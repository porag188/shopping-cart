var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var bodyparser = require('body-parser');
var validator = require('express-validator');

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

var app = express();

// app.use(function(req, res, next) {
//   res.locals.login = req.isAuthenticated();
//   next();
// });
//Data base connecting
var db = require('./config/keys').MongoURI;
mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log('Mongodb Connection stable...'))
  .catch(err => console.log(err));
//passportjs file configaretion appjs
require('./config/passport');
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(
  session({
    secret: 'anystringoftext',
    saveUninitialized: false,
    resave: false,
    httpOnly: false,
    secure: false
  })
);
//useing passport and flash
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  next();
});

app.use('/user', userRouter);
app.use('/', indexRouter);

// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
