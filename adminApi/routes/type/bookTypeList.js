var express = require('express');
var router = express.Router();
const { log,db,oauth, tool } = require("../../tool/require");


/*
*   page 页数
*   limit 一页几条
*
* */
router.use('', oauth(5003),  async function(req, res, next) {

    let limit = tool.getParams(req, 'limit') || 100;
    let page = tool.getParams(req, 'page') || 1;

    let data = null;
    try{
        let count = await tool.redisData.bookTypeList.getBookTypeCount();
        if(!count) {

            /*
            * 以后弄一个common服务，专门弄一个定时任务。。
            * 下面这种写法，目测没问题，但是并发量上去了则会出现一些不可控的bug
            * */
            let allData = await db.query(`Select count(bookType), bookType  from book Group by bookType ORDER BY count(bookType) DESC`);
            tool.redisData.bookTypeList.setBookTypeList(allData);
            count = await tool.redisData.bookTypeList.getBookTypeCount();
        }

        let bookTypeList = await tool.redisData.bookTypeList.getBookTypeList((page-1)*limit, page*limit-1);

        bookTypeList.forEach((value, index) => {
            bookTypeList[index] = JSON.parse(value);
        })

        data = {
            bookTypeList,
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



