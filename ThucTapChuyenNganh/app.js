var createError = require('http-errors');
var express = require('express');//qtr
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var shopRouter = require('./routes/shop');// tạo link dẫn đến shop
var singleRouter = require('./routes/single');
var contactRouter = require('./routes/contact');
var bestsellerRouter = require('./routes/bestseller');
var cartRouter = require('./routes/cart');
var notfindRouter = require('./routes/notfind');
var checkoutRouter = require('./routes/checkout');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/shop', shopRouter);
app.use('/users', usersRouter);
app.use('/single', singleRouter);
app.use('/contact', contactRouter);
app.use('/bestseller', bestsellerRouter);
app.use('/cart', cartRouter);
app.use('/notfind',notfindRouter);
app.use('/checkout', checkoutRouter);



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
