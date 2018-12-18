var express = require('express');
var router = express.Router();
const { oauth, tool, db, log } = require("../../tool/require");

/*
*   page 页数
*   limit 一页几条
*
* */
router.use('', oauth(4006),  async function(req, res, next) {
    let page = tool.getParams(req, 'page') || 1;
    let limit = tool.getParams(req, 'limit') || 10;
    let bookName = tool.getParams(req, 'bookName') || '';
    // let list = await db.query(`select * from progresserror ${whereSql} ORDER BY id ASC limit ${(page-1) * limit},${limit}` );

    let selectSql = `progresserror.*, book.name as bookName, catalog.name as catalogName, catalog.num`;
    let joinSql = `JOIN book on book.id=progresserror.bookId 
	    JOIN catalog on catalog.id=progresserror.catalogId`;

    let whereSql = ``;
    if(bookName) {
        whereSql = `where book.name="${bookName}"`;
    }

    let list = await db.query(`select ${selectSql} from progresserror ${joinSql} ${whereSql} ORDER BY id ASC limit ${(page-1) * limit},${limit}` );
    let count = (await db.query(`select count(*) from progresserror ${joinSql} ${whereSql}`))[0]["count(*)"];
    let errorList = {
        count: count,
        data: list
    };
    res.send(tool.toJson(errorList, '', 1000));
});

module.exports = router;
