var express = require('express');
var router = express.Router();
const { oauth, tool, db, log } = require("../../tool/require");

/*
*   page 页数
*   limit 一页几条
*
* */
router.use('', oauth(1003),  async function(req, res, next) {
    let page = tool.getParams(req, 'page') || 1;
    let limit = tool.getParams(req, 'limit') || 10;

    let bookId = tool.getParams(req, 'bookId');
    let bookName = tool.getParams(req, 'bookName');
    let author = tool.getParams(req, 'author');
    let description = tool.getParams(req, 'description');
    let type = tool.getParams(req, 'type');
    let bookType = tool.getParams(req, 'bookType');
    let bookStatus = tool.getParams(req, 'bookStatus');
    let isJin = tool.getParams(req, 'isJin');
    let fromMe = tool.getParams(req, 'fromMe');
    let books, count, sqlArr = [], sql;
    let searchSqlStart = `select id,name,author,description,reptileType,OriginUrl,type,updateTime,bookStatus,bookType,isJin from book`

    let searchSqlEnd = `limit ${(page - 1) * limit},${limit}`
    if(bookId) {
        sqlArr.push(`id=${bookId}`);
    } else if(bookName) {
        sqlArr.push(`name like '%${bookName}%'`);
    } else if(author) {
        sqlArr.push(`author like '%${author}%'`);
    } else if(description) {
        sqlArr.push(`description like '%${description}%'`);
    }
    if(bookType) {
        sqlArr.push(`bookType='${bookType}'`);
    }
    if(type) {
        sqlArr.push(`type=${type}`);
    }
    if(bookStatus) {
        sqlArr.push(`bookStatus=${bookStatus}`);
    }
    if(isJin) {
        sqlArr.push(`isJin=${isJin}`);
    }
    if(fromMe) {
        sqlArr.push(`reptileType=0`);
    }
    sql = sqlArr.join(" and ");
    if(sql) {
        sql = 'where ' + sql;
    }

    try{
        books = await db.query(`${searchSqlStart} ${sql} ${searchSqlEnd}`);
        count = (await db.query(`select count(*) from book ${sql}`))[0]["count(*)"];
    }catch(err) {
        res.send(tool.toJson(null, '数据出错', 1002));
        return;
    }

    let bookList = {
        count: count,
        book: books
    }

    res.send(tool.toJson(bookList, '', 1000));
});

module.exports = router;
