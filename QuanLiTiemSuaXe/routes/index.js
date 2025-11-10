var express = require('express');
var router = express.Router();

/* GET home page. */
router.all('/*',
    function(
        req,
        res,
        next) {
     res.app.locals.layout='home';
     next();
});
router.get('/', function(req, res) {
    res.render('home/index');
})
router.get('/about', function(req, res, next) {
    res.render('home/about', { title: 'Express' });
});
router.get('/contact', function(req, res, next) {
    res.render('home/contact', { title: 'Express' });
});
router.get('/feature', function(req, res, next) {
    res.render('home/feature', { title: 'Express' });
});
router.get('/pricing', function(req, res, next) {
    res.render('home/pricing', { title: 'Express' });
});

module.exports = router;
