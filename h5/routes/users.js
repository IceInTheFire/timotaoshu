var express = require('express');
var router = express.Router();
const {log} = require("../tool/require");

/* GET users listing. */
router.use('', function(req, res, next) {
  res.send('进入用户页面');
});

module.exports = router;
