var express = require('express');
var router = express.Router();
const { oauth, tool, db, log } = require("../../tool/require");
/*
*   ip列表
*   page 页数
*   limit 一页几条
* */
router.use('', oauth(2005),  async function(req, res, next) {
    let index = tool.getParams(req, 'index');

    if(!index){
        res.send(tool.toJson(null, "index未传", 1002));
        return;
    }

    let count = await tool.redisData.ipList.getIpCount();
    let indexs = index.split(',');
    indexs.forEach((value, index) => {
        if(!(value >= 0)){
            res.send(tool.toJson(null, `${value}不是数字`, 1002));
            return;
        }
        if(value >= count) {
            res.send(tool.toJson(null, `${value}超过了代理ip的长度`, 1002));
            return;
        }
    });

    if(global.delIp) {
        res.send(tool.toJson(null, `删除代理IP的功能，正在被占用中，请稍候`, 1002));
        return;
    }
    global.delIp = true;
    try{
        let result = await tool.redisData.ipList.delIpFromIndex(index);
        global.delIp = false;
        if(result) {
            res.send(tool.toJson({successMsg:'删除成功'}, null, 1000));
        } else {
            res.send(tool.toJson(null, "删除失败", 1002));
        }
    }catch(err) {
        log.error(err);
        global.delIp = false;
        res.send(tool.toJson(null, `删除失败，失败原因：${err}`, 1002));
    }

});

module.exports = router;
