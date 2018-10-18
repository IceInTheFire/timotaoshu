var express = require('express');
var router = express.Router();
const { log,db,oauth, tool } = require("../../tool/require");


/*
*   page 页数
*   limit 一页几条
*
* */
router.use('', oauth(5004),  async function(req, res, next) {

    let limit = tool.getParams(req, 'limit') || 100;
    let page = tool.getParams(req, 'page') || 1;
    try{
        let allData = await db.query(`Select count(bookType), bookType  from book Group by bookType ORDER BY count(bookType) DESC`);
        await tool.redisData.bookTypeList.updateBookTypeList(allData);

        let count = await tool.redisData.bookTypeList.getBookTypeCount();
        let bookTypeList = await tool.redisData.bookTypeList.getBookTypeList((page-1)*limit, page*limit-1);
        bookTypeList.forEach((value, index) => {
            bookTypeList[index] = JSON.parse(value);
        });
        let data = {
            bookTypeList,
            count
        };
        res.send(tool.toJson(data, '', 1000));
    } catch(err) {
        res.send(tool.toJson(null, JSON.stringify(err), 1002));
    }
});

module.exports = router;


// console.log(tool.redisData.authorList.getAuthorList());



