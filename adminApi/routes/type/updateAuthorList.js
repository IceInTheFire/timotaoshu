var express = require('express');
var router = express.Router();
const { log,db,oauth, tool } = require("../../tool/require");

/*
*   page 页数
*   limit 一页几条
*
* */
router.use('', oauth(5002),  async function(req, res, next) {

    let limit = tool.getParams(req, 'limit') || 20;
    let page = tool.getParams(req, 'page') || 1;

    try{
        let allData = await db.query(`Select count(author), author  from book Group by author ORDER BY count(author) DESC`);
        await tool.redisData.authorList.updateAuthorList(allData);

        let count = await tool.redisData.authorList.getAuthorCount();
        let authorList = await tool.redisData.authorList.getAuthorList((page-1)*limit, page*limit-1);
        authorList.forEach((value, index) => {
            authorList[index] = JSON.parse(value);
        });
        let data = {
            authorList,
            count
        };
        res.send(tool.toJson(data, '', 1000));
    } catch(err) {
        res.send(tool.toJson(null, JSON.stringify(err), 1002));
    }
});

module.exports = router;
