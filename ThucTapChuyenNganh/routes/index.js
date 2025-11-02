var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/shop', function(req, res, next) {
    res.render('shop');
});
router.get('/single', function(req, res, next) {
    res.render('single');
});
router.get('/contact', function(req, res, next) {
    res.render('contact');
});
router.get('/bestseller', function(req, res, next) {
    res.render('bestseller');
});
router.get('/cart', function(req, res, next) {
    res.render('cart');
});
router.get('/checkout', function(req, res, next) {
    res.render('checkout');
});
router.get('/404', function(req, res, next) {
    res.render('404');
});
module.exports = router;
