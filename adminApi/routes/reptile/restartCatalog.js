var express = require('express');
var router = express.Router();
const { oauth, tool, db, log, fs, path } = require("../../tool/require");

const getCatalog = require("../../reptileTool/getCatalog");
/*
* 再次爬取
* 也就是爬取错误列表
* */
router.use('', oauth(4007),  async function(req, res, next) {
    let errorId = parseInt(tool.getParams(req, 'errorId'));
    if(!errorId) {
        res.send(tool.toJson(null, 'errorId不可为空', 1002));
        return;
    }
    // if(global.isReptile) {
    //     res.send(tool.toJson(null, '其他任务正在爬取中', 1002));
    //     return;
    // }

    let selectSql = `progresserror.*, catalog.num`;
    let joinSql = `JOIN catalog on catalog.id=progresserror.catalogId`;
    let errorObj = (await db.query(`select ${selectSql} from progresserror ${joinSql} where progresserror.id=${errorId}`))[0];
    if(!errorObj) {
        res.send(tool.toJson(null, 'errorId错误', 1002));
        return;
    }
    let catalog = {
        name:errorObj.catalogName,
        reptileAddress:errorObj.reptileAddress,
        id:errorObj.catalogId
    }
    let result = "";
    // try{
    //     global.isReptile = true;
    //     result = await getCatalog(errorObj.reptileType, errorObj.originUrl, errorObj.bookName ,catalog, true);
    //     global.isReptile = false;
    //     end();
    // }catch(err) {
    //     log.error(err);
    //     result = "错误：" + err;
    //     global.isReptile = false;
    //     end();
    // }
    // global.isReptile = true;
    // let bookId = (await db.query(`select id from book where name='${errorObj.bookName}' and originUrl='${errorObj.originUrl}'`))[0].id;
    /*
    * 只爬取一章
    * */
    tool.catalogQueue.push({
        params:[errorObj.bookId, errorObj.reptileType, errorObj.originUrl, errorObj.bookName ,catalog, true, 20000],
        pro:getCatalog,
        result:() => {
            // global.isReptile = false;
            end(errorObj);
        },
        error:(err) => {
            log.error(err);
            result = "错误：" + err;
            // global.isReptile = false;
            // end();
            end(errorObj);
        }
    })

    async function end(errorObj) {
        // await db.query(`delete from progresserror where id=${errorId}`);

        let whereSql = `where bookName='${errorObj.bookName}' and catalogName='${errorObj.catalogName}' and bookId=${errorObj.bookId} and catalogId=${errorObj.catalogId} and reptileAddress='${errorObj.reptileAddress}' and originUrl='${errorObj.originUrl}'`;

        if(result && result.indexOf("连接10次都是失败") >= 0) {        //删除progresserror表里匹配这个错误除自己外的其他列表
            whereSql += ` and id!=${errorObj.id}`;
            await db.query(`delete from progresserror ${whereSql}`);
            res.send(tool.toJson(null, result, 1002));
            return;
        } else if(result && result.indexOf("错误：") >= 0) {   //删除progresserror表里匹配这个错误除自己外的其他列表
            whereSql += ` and id!=${errorObj.id}`;
            await db.query(`delete from progresserror ${whereSql}`);
            res.send(tool.toJson(null, result, 1002));
            return;
        } else {    //爬取成功        删除progresserror表里匹配到这个错误的所有列表
            await db.query(`delete from progresserror ${whereSql}`);
        }

        res.send(tool.toJson("爬取成功", '', 1000));
    }


});

module.exports = router;
