var express = require('express');
var router = express.Router();
const { oauth, tool, db, log, fs, path } = require("../../tool/require");

/*
*   page 页数
*   limit 一页几条
*
* */
router.use('', oauth(1001),  async function(req, res, next) {
    let catalogId = tool.getParams(req, "catalogId");
    let bookId = tool.getParams(req, "bookId");
    let num = tool.getParams(req, "num");
    if(!bookId) {
        res.send(tool.toJson(null, '没有bookId', 1002));
        return;
    }
    if(!catalogId) {
        res.send(tool.toJson(null, '没有catalogId', 1002));
        return;
    }
    if(!num) {
        res.send(tool.toJson(null, '没有num', 1002));
        return;
    }
    let bookList = await db.query(`select * from book where id=${bookId}`);
    // let catalogList = await db.query(`select * from catalog where bookId=${bookId} and (num >= ${num} or num < ${num}) limit 0, 3`);
    //select * from (select * from catalog where bookId=1111 and num <3700 order by num desc limit 0,1)a union all select * from (select * from catalog where bookId=1111 and num>=3700 order by num limit 0,2 )b
    let catalogList = await db.query(`select * from (select * from catalog where bookId=${bookId} and num < ${num} order by num desc limit 0,1)a union all select * from (select * from catalog where bookId=${bookId} and num >= ${num} order by num limit 0,2 )b`)

    let catalog, book, catalogName, lastCatalog,nextCatalog;

    book = bookList[0];
    /*
    * 当第一个catalog里的num序号等于传来的序号时， 那么代表该catalog是本书要查询的章节，也是本书的第一章
    * 当第二个catalog里的num序号等于传来的序号时， 那么代表该catalog是本书要查询的章节，不是第一章
    * 如果num 都没有匹配到的话，那么返回信息错误
    * */
    if(num == catalogList[0].num && catalogList[0].id == catalogId) {
        catalog = catalogList[0];
        if(catalogList.length == 2) {
            nextCatalog = catalogList[1];
        }
    } else if(num == catalogList[1].num && catalogList[1].id == catalogId) {
        lastCatalog = catalogList[0]
        catalog = catalogList[1];
        if(catalogList.length == 3) {
            nextCatalog = catalogList[2];
        }
    } else {
        res.send(tool.toJson(null, 'catalogId、bookId、num信息不匹配', 1002));
        return;
    }

    catalogName = catalog.name;
    bookName = book.name;

    let container = "";
    // try{
    //     container = fs.readFileSync(path.join(__dirname, '../../../books/' + bookId + "/" + catalogId + ".txt"),'utf-8').toString();
    // }catch(err) {
    //     try {
    //         container = fs.readFileSync(path.join(__dirname, '../../../books/' + bookId + "/" + tool.jiami(catalogId) + ".txt"),'utf-8').toString();
    //     } catch(err) {
    //         // res.send(tool.toJson(null, '没有该文本', 1002));
    //         // return;
    //     }
    //
    // }
    let catalogArr = await db.query(`select * from catalogcontent${await tool.getCatalogNum(catalog.id)} where catalogId=${catalogId} ORDER BY num ASC;`);
    // let catalogArr = db.query(`select * from catalogcontent${await tool.getCatalogNum(catalog.id)} where catalogId=${catalogId};`);
    catalogArr.forEach((value, index) => {
        container += value.content;
    })


    let bookListJson = {
        book: book,
        lastCatalog:lastCatalog,
        catalog: catalog,
        nextCatalog:nextCatalog,
        container: container
    }

    res.send(tool.toJson(bookListJson, '', 1000));
});

module.exports = router;
