var express = require('express');
var router = express.Router();
const { oauth, tool, db, log, fs, path } = require("../../tool/require");


router.use('', oauth(1101),  async function(req, res, next) {
    let container = tool.getParams(req, 'container');
    let catalogId = tool.getParams(req, 'catalogId');
    let bookId = tool.getParams(req, 'bookId');
    let num = tool.getParams(req, 'num');
    if(!container) {
        res.send(tool.toJson(null, 'container不能为空', 1002));
        return;
    }
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
    let catalogList = await db.query(`select * from catalog where id=${catalogId} and bookId=${bookId} and num=${num}`);

    if(bookList.length > 0){
        let reptileType = bookList[0].reptileType;
        let author = bookList[0].author;
        if(reptileType == 0 && author != req.user.name) {
            res.send(tool.toJson(null, '保存失败， 失败原因：书源来自本站，属于原创小说，而您非该原创小说的作者', 1002));
            return ;
        }
    }

    if(bookList.length < 1) {
        res.send(tool.toJson(null, '保存失败， 失败原因：没有这本书', 1002));
        return;
    }
    if(catalogList.length < 1) {
        res.send(tool.toJson(null, '保存失败， 失败原因：没有这个章节', 1002));
        return;
    }
    // let bookName = bookList[0].name;
    // let catalogName = catalogList[0].name;
    // let catalogId = catalogList[0].id;
    try {
        let contentSection = tool.handleContent(container);
        if(contentSection.length<=0) {
            res.send(tool.toJson(null, '保存失败， 失败原因：内容不可为空', 1002));
            return;
        }
        let insertSql = `INSERT INTO catalogcontent${await tool.getCatalogNum(catalogId)} (catalogId, content, bookId, num) VALUES `;
        contentSection.forEach((value, index) => {
            insertSql += `(${catalogId},"${value}", ${bookId}, ${index}),`;
        });
        insertSql = insertSql.slice(0, insertSql.length - 1);
        await db.execTrans([
            `delete from catalogcontent${await tool.getCatalogNum(catalogId)} where catalogId=${catalogId}`,
            insertSql
        ]);
        saveSuccess();
    }catch(err) {
        res.send(tool.toJson(null, '保存失败， 失败原因：'+err, 1002));
    }

    // try {
    //     fs.writeFileSync(path.join(__dirname, '../../../books/' + bookId + "/" + catalogId + ".txt"), container);
    //     saveSuccess();
    // } catch(err) {
    //     try{
    //         fs.writeFileSync(path.join(__dirname, '../../../books/' + bookId + "/" + tool.jiami(catalogId) + ".txt"), container);
    //         saveSuccess();
    //     }catch(err){
    //         res.send(tool.toJson(null, '保存失败， 失败原因：'+err, 1002));
    //     }
    // }


    async function saveSuccess() {
        if(container.length > 20) {
            let errorList = await db.query(`select * from progresserror where bookId=${bookId} and catalogId=${catalogId}`);
            if(errorList.length > 0) {
                await db.execTrans([
                    `delete from progresserror where id=${errorList[0].id}`,
                ]);
                res.send(tool.toJson("保存成功并删除了错误列表里的数据", null, 1000));
            } else {
                res.send(tool.toJson("保存成功", null, 1000));
            }
        } else {
            res.send(tool.toJson("保存成功", null, 1000));
        }
    }

});

module.exports = router;
