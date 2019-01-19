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
    await db.execTrans([
        `delete from progresserror where bookId=${bookId}`,
        `delete from catalogcontent where bookId=${bookId}`,
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
