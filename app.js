var createError = require('http-errors'); //created by Express Generator
var express = require('express'); //created by Express Generator
var path = require('path'); //created by Express Generator
var cookieParser = require('cookie-parser'); //created by Express Generator
var logger = require('morgan'); //created by Express Generator

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
app.use(cookieParser()); //created by Express Generator

function auth(req, res, next) {
  console.log(req.headers);
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    const err = new Error('You are not authenticated!');
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    return next(err);
  }

  const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':'); //Buffer is a global class belonging to Node, and .from is a static method of it. .split and .toString belong to vanilla JavaScript
  const user = auth[0];
  const pass = auth[1];
  if (user === 'admin' && pass === 'password') {
    return next(); //authorized
  } else {
    const err = new Error('You are not authenticated!');
    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    return next(err);
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public'))); //created by Express Generator
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);

app.use('/', indexRouter); //created by Express Generator
app.use('/users', usersRouter); //created by Express Generator

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
