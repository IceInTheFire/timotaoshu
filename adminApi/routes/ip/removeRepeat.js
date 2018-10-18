var express = require('express');
var router = express.Router();
const { oauth, tool, db, log } = require("../../tool/require");

/*
*   ip列表
*   page 页数
*   limit 一页几条
* */
router.use('', oauth(2003),  async function(req, res, next) {


    if(global.reptileIp) {
        res.send(tool.toJson(null, "代理IP正在爬取中，请稍后再试", 1002));
        return;
    }

    if(global.removeRepeat) {
        res.send(tool.toJson(null, "代理IP正在去重中，请耐心等待", 1002));
        return;
    }

    try{
        // let length = await tool.redisData.ipList.getIpCount();
        // console.log(length);
        // log.info(length-1);
        // let ipList = await tool.redisData.ipList.getIpList(0, length - 1);
        // log.info(ipList.length);
        // log.info(ipList);
        let ipList = await tool.redisData.ipList.getAllIpList();
        // log.info(ipList);

        // let set = new Set(ipList);   //ES6中新增了Set数据结构，类似于数组，但是 它的成员都是唯一的 ，其构造函数可以接受一个数组作为参数
        // let ipList2 = Array.from(set);

        let ipList2 = tool.distinct(ipList);

        global.removeRepeat = true;
        await tool.redisData.ipList.updateIpList(ipList2);
        global.removeRepeat = false;
        res.send(tool.toJson("代理IP去重完毕", null, 1000));
    }catch(err){
        log.error(err);
        res.send(tool.toJson(null, `代理ip去重失败，错误原因:${err}`, 1002));
    }
});

module.exports = router;
