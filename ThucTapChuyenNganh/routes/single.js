var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/single', function(req, res, next) {
    res.render('single');
});

module.exports = router;