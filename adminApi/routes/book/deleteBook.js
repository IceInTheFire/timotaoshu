var express = require('express');
var router = express.Router();
const { oauth, tool, db, log, fs, path } = require("../../tool/require");

/*
*   page 页数
*   limit 一页几条
*
* */
router.use('', oauth(1301),  async function(req, res, next) {
    let bookId = parseInt(tool.getParams(req, 'bookId'));
    let bookName = tool.getParams(req, 'bookName');
    if(!bookId) {
        res.send(tool.toJson(null, 'bookId不可为空', 1002));
        return;
    }
    if(!bookName) {
        res.send(tool.toJson(null, 'bookName不可为空', 1002));
        return;
    }
    let bookList = await db.query(`select * from book where id=${bookId} and name="${bookName}"`);

    if(bookList.length <= 0){
        res.send(tool.toJson(null, '没有这本书', 1002));
        return;
    }
    if(bookList.length > 0){
        let reptileType = bookList[0].reptileType;
        let author = bookList[0].author;
        if(reptileType == 0 && author != req.user.name) {
            res.send(tool.toJson(null, '保存失败， 失败原因：书源来自本站，属于原创小说，而您非该原创小说的作者', 1002));
            return ;
        }
    }
    // console.log(`delete from progresserror where bookId=${bookId}`);
    // console.log(`delete from catalogcontent${await tool.getCatalogNum(catalogId)} where bookId=${bookId}`);
    // console.log(`delete from catalog where bookId = ${bookId}`);
    // console.log(`delete from progresserror where bookId=${bookId}`);

    /*
    *
    delete catalogcontent.*, catalogcontent5.*,catalogcontent1050.* from catalogcontent
INNER JOIN  catalogcontent5 on catalogcontent.bookId = catalogcontent5.bookId
INNER JOIN catalogcontent1050 on catalogcontent.bookId = catalogcontent1050.bookId
 where catalogcontent.bookId = 3562;
    * */
    let tables = await tool.getCatalogTables();
    let deleteSqlArr = [];
    if(tables.length > 0) {
        tables.forEach((value, index) =>{
            deleteSqlArr.push(`delete from ${value} where bookId = ${bookId}`);
        });
    }
    // let deleteSql = `delete ${lieArr.join(',')} from ${firstCatalog} ${innerArr.join('  ')} where ${firstCatalog}.bookId = ${bookId}`

    log.info(deleteSqlArr);
    await db.execTrans([
        `delete from progresserror where bookId=${bookId}`,
        // `delete from catalogcontent where bookId=${bookId}`,
        ...deleteSqlArr,
        `delete from catalog where bookId = ${bookId}`,
        `delete from book where id = ${bookId}`,
    ]);
    //
    tool.deleteAll(fs, path.join(__dirname, '../../../books/' + bookId + ".png"));
    // tool.deleteAll(fs, path.join(__dirname, '../../../book_end/' + bookId + '.json'));
    // tool.deleteAll(fs, path.join(__dirname, '../../../book/' + bookId + '.json'));

    res.send(tool.toJson('删除成功', '', 1000));
});

module.exports = router;
