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

var app = express(); //created by Express Generator

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev')); //created by Express Generator
app.use(express.json()); //created by Express Generator
app.use(express.urlencoded({ extended: false })); //created by Express Generator
app.use(cookieParser()); //created by Express Generator
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
