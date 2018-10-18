var express = require('express');
var router = express.Router();
const { oauth, tool, db, log } = require("../../tool/require");
let startIpReptile = require("../../reptileTool/ip/startIpReptile");

/*
*   ip列表
*   page 页数
*   limit 一页几条
* */
router.use('', oauth(2001),  async function(req, res, next) {
    // res.send(tool.toJson(null, "接口暂未开放", 1002));
    let page = tool.getParams(req, 'page') || 1;
    let limit = tool.getParams(req, 'limit')|| 10;
    let noReptile = tool.getParams(req, 'noReptile') || false;
    let data = null;
    let msg = "";
    try{
        let count = await tool.redisData.ipList.getIpCount();
        if(count < 20) {
            /*
            * 若数量小于多少，自动爬取ip
            * */
            if(!noReptile) {
                if(global.removeRepeat) {
                    msg = "代理IP池里的数量小于20，但不能爬取，因为代理IP池正在去重中";
                } else {
                    if(global.reptileIp) {
                        msg = "代理IP池里的数量小于20，正在爬取中";
                    } else {
                        // global.reptileIp = true;
                        // let startPage = Math.floor(Math.random() *100);   //1-100的随机数
                        // msg = "代理IP池里的数量小于20，开始爬取";
                        msg = "代理IP池里的数量小于20,请点击爬取按钮";
                        // startIpReptile(startPage, startPage + 10, 100, async function() {
                        //     //这里后续添加一个redis去重功能  //不知道要不要加  //最好不加
                        //     global.reptileIp = false;
                        // });
                    }
                }
            }
        }

        let ipList2 = await tool.redisData.ipList.getIpList((page-1)*limit, page*limit-1);

        let ipList = [];
        ipList2.forEach((value, index) => {
            let value2 = JSON.parse(value);         // 先变成obj
            value2.index = (page-1)*limit + index;  // index是redis集合里的索引值
            ipList.push(value2);
        });
        data = {
            ipList,
            count
        };
        if(msg) data.msg = msg;
        res.send(tool.toJson(data, '', 1000));
    } catch(err) {
        log.error(err);
        res.send(tool.toJson(null, `${err}`, 1002));
    }
});

module.exports = router;
