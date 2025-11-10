var createError = require('http-errors');
var express = require('express');
var app = express();
const {engine} = require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        defaultLayouts:'layouts',
        partialsDir: path.join(__dirname,'views','partials'),
        layoutsDir: path.join(__dirname,'views','layouts'),
    })
)

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var aboutRouter = require('./routes/about');
var contactRouter = require('./routes/contact');
var featureRouter = require('./routes/feature');
var pricingRouter = require('./routes/pricing');
var adminRouter = require('./routes/admin');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/about', aboutRouter);
app.use('/contact', contactRouter);
app.use('/feature', featureRouter);
app.use('/pricing', pricingRouter);
app.use('/admin',adminRouter);




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
