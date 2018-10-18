var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('', function(req, res, next) {
    res.sendfile('./views/pages/home/html.html');
});

module.exports = router;
