var express = require('express');
var router = express.Router();
const { oauth, tool, db, log } = require("../../tool/require");

/*
* 通过基本信息获取章节列表信息
*
* page      当前页，默认为1
* limit     一页多少条，默认10
* bookName
* bookId
* catalogId
* catalogName
*
* */
router.use('', oauth(),  async function(req, res, next) {
    let page = tool.getParams(req, 'page') || 1;
    let limit = tool.getParams(req, 'limit') || 10;
    let bookId = tool.getParams(req, 'bookId') || null;
    let bookName = tool.getParams(req, 'bookName') || null;
    let catalogName = tool.getParams(req, 'catalogName') || null;
    let catalogId = tool.getParams(req, 'catalogId') || null;


    let selectSql = `catalog.id,catalog.bookId,catalog.name,catalog.num,catalog.type,catalog.createTime,catalog.updateTime,catalog.isJin,catalog.isReptileTool,catalog.reptileAddress`;
    let fromSql = `catalog inner join book on book.id = catalog.bookId`;
    let whereSqlArr = [];
    if(bookId) {
        whereSqlArr.push(`catalog.bookId="${bookId}"`);
    }
    if(bookName) {
        whereSqlArr.push(`book.name="${bookName}"`);
    }
    if(catalogName) {
        whereSqlArr.push(`catalog.name="${catalogName}"`);
    }
    if(catalogId) {
        whereSqlArr.push(`catalog.id="${catalogId}"`);
    }
    let whereSql = ``;
    if(whereSqlArr.length > 0) {
        whereSql = `where ${whereSqlArr.join(" and ")}`;
    }

    let list = await db.query(`select ${selectSql} from ${fromSql} ${whereSql} ORDER BY id ASC limit ${(page-1) * limit},${limit}` );
    let count = (await db.query(`select count(*) from ${fromSql} ${whereSql}`))[0]["count(*)"];
    let catalogList = {
        count: count,
        data: list
    };
    res.send(tool.toJson(catalogList, '', 1000));
});

module.exports = router;
