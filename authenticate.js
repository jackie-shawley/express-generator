const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); //used to create, sign and verify tokens
const FacebookTokenStrategy = require('passport-facebook-token')

const config = require('./config.js');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = user => {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = ((req, res, next) => {
    if (!req.user.admin) {
        err = new Error("You are not authorized to perform this operation!");
        statusCode = 403;
        return next(err);
    } else {
        return next();
    }
});

exports.facebookPassport = passport.use(
    new FacebookTokenStrategy( //first argument. contains the settings
        {
            clientID: config.facebook.clientId,
            clientSecret: config.facebook.clientSecret
        },
        (accessToken, refreshToken, profile, done) => {  //second argument. takes a verified callback
            User.findOne({facebookId: profile.id}, (err, user) => { //check if there is already a user with this info
                if (err) {
                    return done(err, false);
                }
                if (!err && user) {  //no error, but user exists in database; returns no err and the user document
                    return done(null, user);
                } else {  //user could not be found in our database; create new user
                    user = new User({ username: profile.displayName });
                    user.facebookId = profile.id;
                    user.firstname = profile.name.givenName; //this is how FB names the properties on their end so they must be used this way
                    user.lastname = profile.name.familyName; //same as above
                    user.save((err, user) => {
                        if (err) {
                            return done(err, false); //lets passport know there was an error creating the user account
                        } else {
                            return done(null, user);
                        }
                    });
                }
            });
        }
    )
);