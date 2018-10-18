var express = require('express');
var router = express.Router();
const { oauth, tool, db, log } = require("../../tool/require");
let startIpReptile = require("../../reptileTool/ip/startIpReptile");
/*
*   ip列表
*   page 页数
*   limit 一页几条
* */
router.use('', oauth(2004),  async function(req, res, next) {

    let startPage = tool.getParams(req, 'startPage') || 1;
    let endPage = tool.getParams(req, 'endPage') || 3;

    if(global.removeRepeat) {
        res.send(tool.toJson(null, "代理IP正在去重中，请稍后再试", 1002));
        return;
    }

    if(global.reptileIp) {
        res.send(tool.toJson(null, "代理IP正在爬取中，请耐心等待", 1002));
        return;
    }
    global.reptileIp = true;

    startIpReptile(startPage, endPage, async function() {
        //这里后续添加一个redis去重功能  //不知道要不要加
        global.reptileIp = false;
        res.send(tool.toJson("代理IP爬取完毕", null, 1000));
    });
});

module.exports = router;
