var createError = require('http-errors'); //created by Express Generator
var express = require('express'); //created by Express Generator
var path = require('path'); //created by Express Generator
var cookieParser = require('cookie-parser'); //created by Express Generator
var logger = require('morgan'); //created by Express Generator
const session = require('express-session');
const FileStore = require('session-file-store')(session); //when you have two sets of paramaters like this, the initial function returns a function, then it is immediately called in the second parameter list. we must do this to use the FileStore in our app
const passport = require('passport');
const authenticate = require('./authenticate');

var indexRouter = require('./routes/index'); //created by Express Generator
var usersRouter = require('./routes/users'); //created by Express Generator
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');

const mongoose = require('mongoose');


const url = 'mongodb://localhost:27017/nucampsite';
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server'),
  err => console.log(err)
);

var app = express(); //created by Express Generator

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev')); //created by Express Generator
app.use(express.json()); //created by Express Generator
app.use(express.urlencoded({ extended: false })); //created by Express Generator
//app.use(cookieParser('12345-67890-09876-54321')); //created by Express Generator; the key passed in can be anything you want it to be

app.use(session({
  name: 'session-id',
  secret: '12345-67890-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter); 

function auth(req, res, next) {
  console.log(req.user);

  if (!req.user) {
      const err = new Error('You are not authenticated!');                    
      err.status = 401;
      return next(err);
  } else {
      return next();
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public'))); //created by Express Generator
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);



// catch 404 and forward to error handler //created by Express Generator
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler //created by Express Generator
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page //created by Express Generator
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
