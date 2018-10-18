var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('', function(req, res, next) {
    let data= {
        name : 'webarn',
        sex : '男',
        content : '参数,可以更改'
    };
    res.render('pages/home/ejs.ejs',data)
});

module.exports = router;
