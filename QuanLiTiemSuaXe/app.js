var express = require('express');
const moment = require('moment');
const {engine} = require('express-handlebars');
const multer = require('multer');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var methodOverride = require('method-override');

//app.engine('hbs', engine({ defaultLayout: 'layouts' }));
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        defaultLayout: 'layouts',
        partialsDir: path.join(__dirname, 'views', 'partials'),
        layoutsDir: path.join(__dirname, 'views', 'layouts'),
        helpers: {
            // Helper kiểm tra bằng nhau
            ifEquals: function (arg1, arg2, options) {
                return (arg1 && arg2 && arg1.toString() == arg2.toString()) ? options.fn(this) : options.inverse(this);
            },
            formatDate: function (date, format) {
                return moment(date).format(format);
            },
            formatCurrency: function (amount) {
                return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
            },
            not: (value) => !value,
            and: function () {
                return Array.prototype.slice.call(arguments, 0, -1).every(Boolean);
            },
            length: (array) => (array && array.length) ? array.length : 0,
            eq: function (v1, v2) { return v1 === v2; },
            //less than
            lt: function (v1, v2) {
                return v1 < v2;
            },
            //greater than
            gt: function (v1, v2) {
                return v1 > v2;
            },

        }
    })
);
//ghi anh
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));
app.use(flash());
//PASSPORT
app.use(passport.initialize());
app.use(passport.session());


// You might also need custom middleware to make flash messages available in templates
app.use((req, res, next) => {
    res.locals.user = req.user ? req.user.toObject() : null;
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error'); // Passport.js often uses 'error'
    res.locals.errors = req.flash('errors');
    next();
});
//load Route
var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
var khachhangRouter = require('./routes/khachhang');
var dichvuRouter = require('./routes/dichvu');
var sanphamRouter = require('./routes/sanpham');
var hoadonRouter = require('./routes/hoadon');
var lichhenRouter = require('./routes/lichhen');
var caidatRouter = require('./routes/caidat');

console.log(path.join(__dirname, 'views', 'layouts'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/admin/users', usersRouter);
app.use('/admin/datamanagement', khachhangRouter);
app.use('/admin/datamanagement', dichvuRouter);
app.use('/admin/datamanagement', sanphamRouter);
app.use('/admin/hoadon', hoadonRouter);
app.use('/admin/lichhen', lichhenRouter);
app.use('/admin/caidat', caidatRouter);

//database mongoDB
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {Strategy: LocalStrategy} = require("passport-local");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1/node') // No callback here
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
    });
//end mongoDB
module.exports = app;
