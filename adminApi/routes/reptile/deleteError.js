var express = require('express');
var router = express.Router();
const { oauth, tool, db, log, fs, path } = require("../../tool/require");


// 错误列表的删除，不允许随便删除。。删除的时候，后台做个判断相对应章节是否空白的判断。如果空白，不允许删除，不是空白，允许删除


router.use('', oauth(4009),  async function(req, res, next) {
    let errorId = parseInt(tool.getParams(req, 'errorId'));
    if(!errorId) {
        res.send(tool.toJson(null, 'errorId不可为空', 1002));
        return;
    }
    let errorList = await db.query(`select * from progresserror where id = ${errorId}`);
    if(errorList.length > 0) {
        let errorInfo = errorList[0];

        // let catalogList = await db.query(`select catalog.name from catalog inner JOIN book on catalog.bookId = book.id
// where catalog.name = '${errorInfo.catalogName}' and book.name = '${errorInfo.bookName}'`)
        let bookId = errorInfo.bookId;
        let catalogId = errorInfo.catalogId;
        // let catalogInfo = {};
        // if(catalogList.length > 0) {
            // catalogInfo = catalogList[0];
        // }
        // let catalogName = catalogInfo.name;
        // let bookName = errorInfo.bookName;
        let container = "";
        let catalogArr = await db.query(`select * from catalogcontent${await tool.getCatalogNum(catalogId)} where catalogId=${catalogId} ORDER BY num ASC;`);
        catalogArr.forEach((value, index) => {
            container += value.content;
        })
        if(container.length < 20) {
            res.send(tool.toJson(null, '章节错误，不允许删除', 1002));
        } else{
            await db.execTrans([
                `delete from progresserror where id=${errorId}`,
            ]);
            res.send(tool.toJson('删除成功', '', 1000));
        }
    } else {
        res.send(tool.toJson(null, '没有该errorId', 1002));
    }
});

module.exports = router;
