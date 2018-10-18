var express = require('express');
var router = express.Router();
const { log,db,oauth, tool } = require("../../tool/require");


/*
*   page 页数
*   limit 一页几条
*
* */
router.use('', oauth(5001),  async function(req, res, next) {

    let limit = tool.getParams(req, 'limit') || 20;
    let page = tool.getParams(req, 'page') || 1;

    let data = null;
    try{
        let count = await tool.redisData.authorList.getAuthorCount();
        if(!count) {

            /*
            * 以后弄一个common服务，专门弄一个定时任务。。
            * 下面这种写法，目测没问题，但是并发量上去了则会出现一些不可控的bug
            * */
            let allData = await db.query(`Select count(author), author  from book Group by author ORDER BY count(author) DESC`);
            tool.redisData.authorList.setAuthorList(allData);
            count = await tool.redisData.authorList.getAuthorCount();
        }

        let authorList = await tool.redisData.authorList.getAuthorList((page-1)*limit, page*limit-1);

        authorList.forEach((value, index) => {
            authorList[index] = JSON.parse(value);
        })

        data = {
            authorList,
            count
        };
        res.send(tool.toJson(data, '', 1000));
    } catch(err) {
        res.send(tool.toJson(null, JSON.stringify(err), 1002));
    }
    // res.send(tool.toJson(data, '', 1000));
});

module.exports = router;


// console.log(tool.redisData.authorList.getAuthorList());



