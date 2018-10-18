var express = require('express');
var router = express.Router();
const { oauth, tool} = require("../../tool/require");
const getBooksFromJson = require("../../reptileTool/getBooksFromJson");


// let isReptile = false;   //是否正在爬取
// global.isReptile
/*
*   配置列表
*   page 页数
*   limit 一页几条
*
* */
let lastTime = 0;
router.use('', oauth(4003),  async function(req, res, next) {
    if(global.isReptile) {
        let startTime = new Date().getTime();
        if(startTime - lastTime > 1000*60*60){  //距离上次爬取超过一个小时
            global.isReptile = false;
        }
        lastTime = startTime;
    }


    if(global.isReptile) {
        res.send(tool.toJson(null, '正在爬取中...', 1002));
    } else {

        global.isReptile = true;
        getBooksFromJson(() => {
            global.isReptile = false;
        });
        res.send(tool.toJson(null, '开始爬取', 1000));
    }
});

module.exports = router;
