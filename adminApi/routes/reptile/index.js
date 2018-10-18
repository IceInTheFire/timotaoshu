var express = require('express');
var router = express.Router();
const { oauth, tool, db, log } = require("../../tool/require");

/*
*   配置列表
*   page 页数
*   limit 一页几条
*
* */
router.use('', oauth(4004),  async function(req, res, next) {
    let page = tool.getParams(req, 'page') || 1;
    let limit = tool.getParams(req, 'limit') || 10;

    let data = null;
    try{
        let count = await tool.redisData.reptileList.getReptileCount();
        if(!count) {

            /*
            * 以后弄一个common服务，专门弄一个定时任务。。
            * 下面这种写法，目测没问题，但是并发量上去了则会出现一些不可控的bug
            * */
            let allData = await db.query(`select id,codeType,originUrl,remark from reptiletool`);
            tool.redisData.reptileList.setReptileList(allData);
            count = await tool.redisData.reptileList.getReptileCount();
        }

        let reptileList = await tool.redisData.reptileList.getReptileList((page-1)*limit, page*limit-1);

        reptileList.forEach((value, index) => {
            reptileList[index] = JSON.parse(value);
        })

        data = {
            reptileList,
            count
        };
        res.send(tool.toJson(data, '', 1000));
    } catch(err) {
        res.send(tool.toJson(null, JSON.stringify(err), 1002));
    }
    // let reptile = await db.query(`select id,codeType,originUrl,remark from reptileTool limit ${(page-1) * limit},${limit}` );
    // let count = (await db.query(`select count(*) from reptileTool`))[0]["count(*)"];
    // let reptileList = {
    //     count: count,
    //     list: reptile
    // };
    //
    // res.send(tool.toJson(reptileList, '', 1000));
});

module.exports = router;
