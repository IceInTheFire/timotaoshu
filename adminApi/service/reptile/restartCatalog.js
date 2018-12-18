const { oauth, tool, db, log, fs, path } = require("../../tool/require");
let getCatalog = require("../../reptileTool/getCatalog.js");
// let getCatalog = require(__base + "reptileTool/getCatalog.js");

async function restartCatalog(errorId) {
    return new Promise(async (resolve, reject) => {
        if(!errorId) {
            reject("errorId不可为空");
            return;
        }
        let selectSql = `progresserror.*, catalog.num`;
        let joinSql = `JOIN catalog on catalog.id=progresserror.catalogId`;
        let errorObj = (await db.query(`select ${selectSql} from progresserror ${joinSql} where progresserror.id=${errorId}`))[0];
        if(!errorObj) {
            reject("errorId错误");
            return;
        }
        let catalog = {
            name:errorObj.catalogName,
            reptileAddress:errorObj.reptileAddress,
            id:errorObj.catalogId
        }
        let result = "";
        /*
         * 只爬取一章
          * */
        tool.catalogQueue.push({
            params:[errorObj.bookId, errorObj.reptileType, errorObj.originUrl, errorObj.bookName ,catalog, true, 20000],
            pro:getCatalog,
            result:() => {
                end(errorObj, resolve, reject);
            },
            error:(err) => {
                log.error(err);
                result = "错误：" + err;
                end(errorObj, resolve, reject);
            }
        });


        async function end(errorObj, resolve, reject) {
            let whereSql = `where bookName='${errorObj.bookName}' and catalogName='${errorObj.catalogName}' and bookId=${errorObj.bookId} and catalogId=${errorObj.catalogId} and reptileAddress='${errorObj.reptileAddress}' and originUrl='${errorObj.originUrl}'`;

            if(result && result.indexOf("连接10次都是失败") >= 0) {        //删除progresserror表里匹配这个错误除自己外的其他列表
                whereSql += ` and id!=${errorObj.id}`;
                await db.query(`delete from progresserror ${whereSql}`);
                reject(result)
                return;
            } else if(result && result.indexOf("错误：") >= 0) {   //删除progresserror表里匹配这个错误除自己外的其他列表
                whereSql += ` and id!=${errorObj.id}`;
                await db.query(`delete from progresserror ${whereSql}`);
                reject(result)
                return;
            } else {    //爬取成功        删除progresserror表里匹配到这个错误的所有列表
                await db.query(`delete from progresserror ${whereSql}`);
            }
            resolve("爬取成功");
        }
    });
}


module.exports = restartCatalog;