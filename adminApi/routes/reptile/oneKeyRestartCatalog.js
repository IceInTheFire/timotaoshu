var express = require('express');
var router = express.Router();
const {oauth, tool, db, log, fs, path} = require("../../tool/require");

const getCatalog = require("../../reptileTool/getCatalog");
let lastTime = 0;
/*
* 一键爬取错误列表
* 也就是爬取错误列表
* */
router.use('', oauth(4008), async function (req, res, next) {
    let bookName = tool.getParams(req, 'bookName');
    let startTime = new Date().getTime();
    if(!bookName && (startTime - lastTime <= 1000*60*5)){
        res.send(tool.toJson(null, '五分钟内不可再次一键全部爬取', 1002));
        return;
    }else if(!bookName){
        lastTime = startTime;
    }
    // if (!bookName) {
    //     res.send(tool.toJson(null, 'bookName不可为空', 1002));
    //     return;
    // }
    // if (global.isReptile) {
    //     res.send(tool.toJson(null, '其他任务正在爬取中', 1002));
    //     return;
    // }
    let whereSql = ``
    if(bookName) {
        let books = await db.query(`select * from book where name='${bookName}'`);
        let i2 = 0, length2 = books.length;
        if(length2 <= 0) {
            res.send(tool.toJson(null, `没有${bookName}这本书`, 1002));
            return;
        }
        whereSql = `where `
        for (i2; i2 < length2; i2++) {
            if(i2 == length2-1) {
                whereSql+= `progresserror.bookId=${books[i2].id}`;
            } else {
                whereSql+= `progresserror.bookId=${books[i2].id} or `;
            }
        }
    } else {        //默认全部
        bookName = 'all';
    }

    let selectSql = `progresserror.*, catalog.num`;
    let joinSql = `JOIN catalog on catalog.id=progresserror.catalogId`;
    let errorObjs = await db.query(`select ${selectSql} from progresserror ${joinSql} ${whereSql}`);
    let i = 0, length = errorObjs.length;

    // global.isReptile = true;
    // let errorCount = 0;
    // for(i; i<length; i++) {
    //     let errorObj = errorObjs[i];
    //     log.info(JSON.stringify(errorObj));
    //     let catalog = {
    //         title:errorObj.catalogName,
    //         href:errorObj.reptileAddress
    //     }
    //     let result = "";
    //     try{
    //         result = await getCatalog(errorObj.reptileType, errorObj.originUrl, errorObj.bookName ,catalog, true);
    //         if(result && result.indexOf("连接10次都是失败") >= 0) {
    //             errorCount++;
    //         } else if(result && result.indexOf("错误：") >= 0) {
    //             errorCount++;
    //         }
    //     }catch(err) {
    //         log.error(err);
    //         result = "错误：" + err;
    //     }
    //     await db.query(`delete from progresserror where id=${errorObj.id}`);
    // }
    //
    // global.isReptile = false;
    // res.send(tool.toJson(`爬取完毕，共爬取${length}条，${errorCount}条失败`, '', 1000));

    let errorResponseCount = 0;  //响应的适量
    let errorCount = 0;     //爬取失败的数量
    if (length <= 0) {
        res.send(tool.toJson(`爬取完毕，共爬取${length}条，${errorCount}条失败`, '', 1000));
        return;
    }
    // global.isReptile = true;
    for (i; i < length; i++) {
        let errorObj = errorObjs[i];
        let catalog = {
            name: errorObj.catalogName,
            reptileAddress: errorObj.reptileAddress,
            id:errorObj.catalogId
        }
        // let bookId = (await db.query(`select id from book where name='${errorObj.bookName}' and originUrl='${errorObj.originUrl}'`))[0].id;
        let bookId = errorObj.bookId;
        let result = "";
        tool.catalogQueue.push({
            params: [bookId, errorObj.reptileType, errorObj.originUrl, errorObj.bookName, catalog, true, 20000],
            pro: getCatalog,
            result: (data) => {
                result = data;
                end(result, errorObj);
            },
            error: (err) => {
                log.error(err);
                result = "错误：" + err;
                end(result, errorObj);
            }
        });
    }


    async function end(result,errorObj) {
        errorResponseCount++;
        let whereSql = `where bookName='${errorObj.bookName}' and catalogName='${errorObj.catalogName}' and bookId=${errorObj.bookId} and catalogId=${errorObj.catalogId} and reptileAddress='${errorObj.reptileAddress}' and originUrl='${errorObj.originUrl}'`;

        if (result && result.indexOf("连接10次都是失败") >= 0) {   //删除progresserror表里匹配这个错误除自己外的其他列表
            errorCount++;
            whereSql += ` and id!=${errorObj.id}`;
        } else if (result && result.indexOf("错误：") >= 0) {  //删除progresserror表里匹配这个错误除自己外的其他列表
            errorCount++;
            whereSql += ` and id!=${errorObj.id}`;
        } else {  //爬取成功        删除progresserror表里匹配到这个错误的所有列表
        }
        await db.query(`delete from progresserror ${whereSql}`);

        log.info(`错误列表，一键《${bookName}》爬取共${length}条，已响应${errorResponseCount}条，失败${errorCount}条`)
        if (errorResponseCount == length) {
            log.info(`错误列表的《${bookName}》一键爬取任务结束`);
            log.info(`爬取完毕，共爬取${length}条，${errorCount}条失败`);
            // global.isReptile = false;
            res.send(tool.toJson(`爬取完毕，共爬取${length}条，${errorCount}条失败`, '', 1000));
        }
        // res.send(tool.toJson("爬取成功", '', 1000));
    }

});

module.exports = router;
