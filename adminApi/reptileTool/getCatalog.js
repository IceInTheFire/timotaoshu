const {fs, rp,timoRp, cheerio, iconv, path, tool, wss, log, db} = require("../tool/require");
// let reptileCommon = require("./common/reptileCommon")


module.exports = async (bookId, reptileType, baseUrl, bookName, catalog, noIsRepeat, timeout) => {
    return getCatalog_common(bookId, baseUrl, bookName, catalog, noIsRepeat, parseInt(reptileType), parseInt(timeout));
}

async function getCatalog_common(bookId, baseUrl, bookName, catalog, noIsRepeat, reptileType, timeout) {
    return new Promise(async (resolve, reject) => {
        let reptileCommon2 = require("./common/reptileCommon2")
        let reptileCommon = await reptileCommon2(reptileType);
        let start = 0;
        let startTime = new Date().getTime();
        global.reptileCatalog++;
        console.log(`当前有${global.reptileCatalog}条章节正在爬取`)
        await startRp();

        async function startRp() {
            try{
                let msg = await startRpFn();
                resolve(msg);
            } catch(err) {
                reject(err);
                log.error("超乎意料的bug:超乎意料的bug:超乎意料的bug:超乎意料的bug:超乎意料的bug:超乎意料的bug:超乎意料的bug:超乎意料的bug:超乎意料的bug:超乎意料的bug:超乎意料的bug:超乎意料的bug:超乎意料的bug:超乎意料的bug:超乎意料的bug:超乎意料的bug:超乎意料的bug:超乎意料的bug:超乎意料的bug:超乎意料的bug:超乎意料的bug:超乎意料的bug:" + err)
            }

            async function startRpFn(){
                return new Promise(async (resolve2, reject2) => {
                    start++;
                    let uri = "";
                    if(catalog.reptileAddress && catalog.reptileAddress.indexOf("http") == 0) {
                        uri = catalog.reptileAddress;
                    } else {
                        uri = baseUrl + catalog.reptileAddress;
                    }
                    let option = {
                        uri:uri,
                        encoding : null,
                        headers:{
                            //模拟谷歌浏览器
                            "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36"
                        },
                        transform: function(body, response, resolveWithFullResponse) {
                            return [cheerio.load(iconv.decode(body, reptileCommon.code), {decodeEntities: false}),iconv.decode(body, reptileCommon.code)];
                        },
                        timeout: timeout || 10000
                    };
                    let ip = await tool.redisData.ipList.getRandomIpList();
                    if(ip) option.proxy = ip;
                    timoRp(option).then(async function(data) {
                        let $ = data[0];
                        let content = "";
                        global.reptileCatalog--;
                        try{
                            content = reptileCommon.getCatalogContent($);
                            await saveContent(baseUrl, bookId, bookName, catalog, noIsRepeat, content);
                            resolve2();
                        }catch(err) {

                            await db.query(`INSERT INTO progresserror (reptileType, originUrl, bookId, catalogId, reptileAddress, bookName, catalogName) VALUES (${reptileType}, '${baseUrl}', '${bookId}', '${catalog.id}', '${catalog.reptileAddress}', '${bookName}', '${catalog.name}')`);

                            let endTime = new Date().getTime();
                            log.error(`异常失败,开始时间${startTime},结束时间${endTime},耗时${endTime-startTime}毫秒`);
                            log.error(" 错误地址： " + baseUrl + catalog.reptileAddress + ",代理IP：" + ip);
                            log.error("异常错误（谨慎）：" + err);
                            resolve2("异常错误（谨慎）：" +err);
                        }

                    }).catch(async (err) => {
                        if(start >= 10) {
                            global.reptileCatalog--;
                            // console.log(`catch：现在有${global.reptileCatalog}条章节正在爬取`)
                            log.error(" 错误地址： " + baseUrl + catalog.reptileAddress + ",代理IP：" + ip);
                            let endTime = new Date().getTime();
                            log.error(`响应失败,开始时间${startTime},结束时间${endTime},耗时${endTime-startTime}毫秒`);
                            // reject(err);
                            log.error("连接10次都是失败，失败原因：" + err);

                            await db.query(`INSERT INTO progresserror (reptileType, originUrl, bookId, catalogId, reptileAddress, bookName, catalogName) VALUES (${reptileType}, '${baseUrl}', '${bookId}', '${catalog.id}', '${catalog.reptileAddress}', '${bookName}', '${catalog.name}')`);
                            resolve2("连接10次都是失败" + err);  //连接10次都是失败   最好不要改，其他程序是判断这几个字的。
                        } else {
                            resolve2(await startRpFn())
                        }
                    });
                });
            }

        }
    });
}

async function saveContent(baseUrl, bookId, bookName, catalog, noIsRepeat, content) {
    try {

        let contentSection = tool.handleContent(content);
        if(contentSection.length <= 0) {
            return;
        }
        let insertSql = `INSERT INTO catalogcontent (catalogId, content, bookId, num) VALUES `;
        contentSection.forEach((value, index) => {
            insertSql += `(${catalog.id},"${tool.toSql(value)}", ${bookId},${index}),`;
        });
        insertSql = insertSql.slice(0, insertSql.length - 1);
        if(noIsRepeat) {
            await db.query(`delete from catalogcontent where catalogId=${catalog.id}`);
        } else {}

        await db.query(insertSql);
        wss.broadcast(bookName + "---" + catalog.name + "存取成功");
    } catch (err) {
        log.error(err);
    }
}