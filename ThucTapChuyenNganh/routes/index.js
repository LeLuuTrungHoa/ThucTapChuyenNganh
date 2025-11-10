// var express = require('express');
// var router = express.Router();
//
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
//
//
// module.exports = router;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.all('/*', function(
    req,
    res,
    next) {
   res.app.locals.layout = 'home';
   next();
});

router.get('/', function(req, res, next) {
    res.render('home/index',{title:'Express'}) ;
});

router.get('/shop', function(req, res, next) {
    res.render('home/shop');
});
// router.get('/best_seller', function(req, res, next) {
//     res.render( 'home/best_seller');
// });
// router.get('/single', function(req, res, next) {
//     res.render( 'home/single');
// });
// router.get('/contact', function(req, res, next) {
//     res.render( 'home/contact');
// });
module.exports = router;
