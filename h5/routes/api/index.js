var express = require('express');
var router = express.Router();
const {log, tool} = require("../../tool/require");

/* GET users listing. */
router.use('', function(req, res, next) {
    // tool.allowVisit(res); //为了跨域
  // res.send('你好，欢迎来到提莫淘书h5接口文档世界<br><a href="http://localhost:1111/api">接口文档地址</a>');
    res.render('api/index', { title: '提莫淘书接口文档', href:'http://localhost:1111/_book/'});
});

module.exports = router;
