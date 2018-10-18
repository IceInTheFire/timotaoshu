var express = require('express');
var router = express.Router();
const { oauth, tool, db,log} = require("../../tool/require");
const getBookUrl = require("../../reptileTool/getBookUrl");

/*
*   获取书的url地址
* */
router.use('', oauth(4002),  async function(req, res, next) {
    let bookName = tool.getParams(req, 'bookName');
    let reptileType = tool.getParams(req, 'reptileType') || 0;
    let isProxy = tool.getParams(req, 'isProxy') || "true";
    if(isProxy == "true")
        isProxy = true;
    else
        isProxy = false;
    try{
        await
        getBookUrl(reptileType, bookName, async function(urlList) {
            let i = 0, length = urlList.length;
            for(i; i<length; i++) {
                let value = urlList[i];
                let count = (await db.query(`select count(*) from book where name='${value.title}' and author='${value.author}'`))[0]["count(*)"];
                if(count) {
                    value.reptile = "已获取"
                } else {
                    value.reptile = "点击获取小说"
                }
            }
            res.send(tool.toJson(urlList, '', 1000));
        }, async function(error) {
            res.send(tool.toJson(null, "获取链接失败，失败原因：" + error, 1002));
        },isProxy);
    } catch(err) {
        res.send(tool.toJson(null, err, 1002));
    }
});

module.exports = router;