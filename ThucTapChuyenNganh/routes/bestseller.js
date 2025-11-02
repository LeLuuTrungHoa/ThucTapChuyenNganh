var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/bestseller', function(req, res, next) {
    res.render('bestseller');
});

module.exports = router;