var express = require('express');
var router = express.Router();
const { oauth, tool, db, log, fs, path } = require("../../tool/require");
const getCatalog = require("../../reptileTool/getCatalog");


router.use('', oauth(1203),  async function(req, res, next) {
    let catalogId = tool.getParams(req, 'catalogId');
    let bookId = tool.getParams(req, 'bookId');
    let num = tool.getParams(req, 'num');
    if(!catalogId) {
        res.send(tool.toJson(null, 'catalogId不能为空', 1002));
        return;
    }
    if(!bookId) {
        res.send(tool.toJson(null, 'bookId不能为空', 1002));
        return;
    }
    if(!num) {
        res.send(tool.toJson(null, 'num不能为空', 1002));
        return;
    }

    let bookList = await db.query(`select * from book where id=${bookId}`);
    if(bookList.length > 0){
        let reptileType = bookList[0].reptileType;
        if(reptileType == 0) {
            res.send(tool.toJson(null, '更新失败， 失败原因：书源来自本站，属于原创小说', 1002));
            return ;
        }
    }
    let catalogList = await db.query(`select * from catalog where id=${catalogId} and bookId=${bookId} and num=${num}`);
    if(bookList.length < 1) {
        res.send(tool.toJson(null, '更新失败， 失败原因：没有这本书', 1002));
        return;
    }
    if(catalogList.length < 1) {
        res.send(tool.toJson(null, '更新失败， 失败原因：没有这个章节', 1002));
        return;
    }
    let book = bookList[0];
    let catalog = catalogList[0];

    // let href = bookList[0].originUrl + catalogList[0].reptileAddress;
    let bookObj = {
        name:catalog.name,
        reptileAddress:catalog.reptileAddress,
        id:catalog.id
    };
    await getCatalog(bookId, book.reptileType, book.originUrl, book.name, bookObj, true);


    let container = "";
    // try{
    //     container = fs.readFileSync(path.join(__dirname, '../../../books/' + bookId + "/" + catalogId + ".txt"),'utf-8').toString();
    // }catch(err) {
    //     try {
    //         container = fs.readFileSync(path.join(__dirname, '../../../books/' + bookId + "/" + tool.jiami(catalogId) + ".txt"),'utf-8').toString();
    //     } catch(err) {
    //         res.send(tool.toJson(null, '更新失败', 1002));
    //         return;
    //     }
    // }
    let catalogArr = await db.query(`select * from catalogcontent${await tool.getCatalogNum(catalog.id)} where catalogId=${catalogId} ORDER BY num ASC;`);
    catalogArr.forEach((value, index) => {
        container += value.content;
    })




    let bookListJson = {
        container: container
    }

    res.send(tool.toJson(bookListJson, '', 1000));
});

module.exports = router;
