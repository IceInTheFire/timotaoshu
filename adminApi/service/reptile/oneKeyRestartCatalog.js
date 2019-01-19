const {oauth, tool, db, log, fs, path} = require("../../tool/require");
let getCatalog = require("../../reptileTool/getCatalog.js");

async function oneKeyRestartCatalog(bookName) {
    return new Promise(async (resolve, reject) => {
        let startTime = new Date().getTime();
        if(!bookName && (startTime - (global.oneKeyRestartLastTime || 0) <= 1000*60*5)){
            reject('五分钟内不可再次一键全部爬取');
            return;
        } else if(!bookName) {
            global.oneKeyRestartLastTime = startTime;
        }
        let whereSql = ``
        if(bookName) {
            let books = await db.query(`select * from book where name='${bookName}'`);
            let i2 = 0, length2 = books.length;
            if(length2 <= 0) {
                reject(`没有${bookName}这本书`);
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
        }
        let selectSql = `progresserror.*, catalog.num`;
        let joinSql = `JOIN catalog on catalog.id=progresserror.catalogId`;
        let errorObjs = await db.query(`select ${selectSql} from progresserror ${joinSql} ${whereSql}`);
        let i = 0, length = errorObjs.length;
        let errorResponseCount = 0;  //响应的适量
        let errorCount = 0;     //爬取失败的数量
        if (length <= 0) {
            resolve(`爬取完毕，共爬取${length}条，${errorCount}条失败`)
            return;
        }
        for (i; i < length; i++) {
            let errorObj = errorObjs[i];
            let catalog = {
                name: errorObj.catalogName,
                reptileAddress: errorObj.reptileAddress,
                id:errorObj.catalogId
            }
            let bookId = errorObj.bookId;
            let result = "";
            tool.catalogQueue.push({
                params: [bookId, errorObj.reptileType, errorObj.originUrl, errorObj.bookName, catalog, true, 20000],
                pro: getCatalog,
                result: (data) => {
                    result = data;
                    end(result, errorObj, resolve, reject);
                },
                error: (err) => {
                    log.error(err);
                    result = "错误：" + err;
                    end(result, errorObj, resolve, reject);
                }
            });
        }

        async function end(result, errorObj, resolve, reject) {
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

            log.info(`错误列表，一键《${errorObj.bookName}》爬取共${length}条，已响应${errorResponseCount}条，失败${errorCount}条`)
            if (errorResponseCount == length) {
                log.info(`错误列表的《${errorObj.bookName}》一键爬取任务结束`);
                log.info(`爬取完毕，共爬取${length}条，${errorCount}条失败`);
                resolve(`爬取完毕，共爬取${length}条，${errorCount}条失败`);
            }
        }
    });
}

module.exports = oneKeyRestartCatalog;