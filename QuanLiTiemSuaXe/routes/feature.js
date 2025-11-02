var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/feature', function(req, res, next) {
    res.render('feature', { title: 'Express' });
});

module.exports = router;