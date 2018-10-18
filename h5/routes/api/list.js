var express = require('express');
var router = express.Router();
const { tool, db, log } = require("../../tool/require");

/*
*   page 页数
*   limit 一页几条
*
* */
router.use('', async function(req, res, next) {
    tool.allowVisit(res); //为了跨域

    let isRandom = req.query.isRandom || req.body.isRandom || '';
    if(!isRandom || isRandom.toLowerCase() == 'false') {
        isRandom = false;
    }
    let limit = parseInt(req.query.limit || req.body.limit) || 10;

    if(isRandom) {  //随机
        let book = await db.query(`SELECT * FROM book where isJin = 1 and type = 3 ORDER BY RAND() LIMIT ${limit}`)

        res.render('pages/home/index', { myUrl:'/home/index',bookList: book });
        return;
    }

    let page = parseInt(req.query.page || req.body.page) || 1;


    let bookId = parseInt(req.query.bookId || req.body.bookId);
    let bookName = req.query.bookName || req.body.bookName;
    let author = req.query.author || req.body.author;
    let description = req.query.description || req.body.description;
    let type = req.query.type || req.body.type;
    let bookType = req.query.bookType || req.body.bookType;
    let bookStatus = req.query.bookStatus || req.body.bookStatus;
    let isJin = req.query.isJin || req.body.isJin;
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
