var express = require('express');
var router = express.Router();
const { oauth, tool } = require("../../tool/require");

router.use('', oauth(),  async function(req, res, next) {
    let pwd = tool.getParams(req, 'pwd');

    if(req.user.pwd == pwd) {
        res.send(tool.toJson(req.user, '', 1000));
    } else {
        res.send(tool.toJson(null, '解锁失败', 1002));
    }
});

module.exports = router;
