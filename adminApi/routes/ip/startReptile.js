var express = require('express');
var router = express.Router();
const { oauth, tool, db, log } = require("../../tool/require");
let {ipReptileService} = require("../../service/");
/*
*   ip列表
*   page 页数
*   limit 一页几条
* */
router.use('', oauth(2004),  async function(req, res, next) {

    let startPage = tool.getParams(req, 'startPage') || 1;
    let endPage = tool.getParams(req, 'endPage') || 3;

    ipReptileService.startReptile(startPage, endPage).then((msg) => {
        res.send(tool.toJson(null, msg, 1000));
    }).catch((err) => {
        res.send(tool.toJson(null, err, 1002));
    });
});

module.exports = router;
