const {fs, rp,timoRp, cheerio, iconv, path, tool, wss, log, db} = require("../tool/require");
// let reptileCommon = require("./common/reptileCommon")
const reptileCommon2 = require("./common/reptileCommon2")

module.exports = async (bookId, reptileType, originUrl, bookName, catalog, noIsRepeat, timeout,tiType) => {
    return getCatalog_common(bookId, originUrl, bookName, catalog, noIsRepeat, parseInt(reptileType), parseInt(timeout), tiType);
}

async function getCatalog_common(bookId, originUrl, bookName, catalog, noIsRepeat, reptileType, timeout, tiType) {
    return new Promise(async (resolve, reject) => {

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
                    // 用小说目录的url地址做章节url前缀    默认 1
                    // 用小说主站url地址做章节url前缀   2
                    // 不使用前缀，3
                    if(catalog.reptileAddress && catalog.reptileAddress.indexOf("http") == 0) {
                        uri = catalog.reptileAddress;
                    } else if(reptileCommon.originUrlBefore == 2) {
                        uri = reptileCommon.baseUrl + catalog.reptileAddress;
                    } else {
                        uri = originUrl + catalog.reptileAddress;
                    }
                    let option = {
                        uri:uri,
                        userAgent: reptileCommon.userAgent,
                        encoding : null,
                        transform: function(body, response, resolveWithFullResponse) {
                            // return cheerio.load(iconv.decode(body, "gbk"), {decodeEntities: false});
                            // return [cheerio.load(iconv.decode(body, "utf-8"), {decodeEntities: false}),iconv.decode(body, "utf-8")];
                            // console.log(iconv.decode(body, reptileCommon.code));
                            return [cheerio.load(iconv.decode(body, reptileCommon.code), {decodeEntities: false}),iconv.decode(body, reptileCommon.code)];
                        },
                        timeout: timeout || 10000
                    };
                    try{
                        let data = await timoRp(option);
                        let $ = data[0];
                        // let body = data[1];
                        let content = "";
                        global.reptileCatalog--;
                        try{
                            content = reptileCommon.getCatalogContent($);
                            let saveSuccess = await saveContent(originUrl, bookId, bookName, catalog, noIsRepeat, content,reptileType,uri,tiType);
                            if(saveSuccess){
                                resolve2();
                            } else{
                                resolve2("错误：存取失败");
                            }
                        }catch(err) {
                            // log.error("我只是看个问题" + bookName + "_" + book.title);
                            // log.error(err);

                            await db.query(`INSERT INTO progresserror (reptileType, originUrl, bookId, catalogId, reptileAddress, bookName, catalogName) VALUES (${reptileType}, "${originUrl}", "${bookId}", "${catalog.id}", "${catalog.reptileAddress}", "${bookName}", "${catalog.name}")`);

                            let endTime = new Date().getTime();
                            log.error(`异常失败,开始时间${startTime},结束时间${endTime},耗时${endTime-startTime}毫秒`);
                            log.error(" 错误地址： " + originUrl + catalog.reptileAddress + "，代理IP：" + option.proxy);
                            log.error("异常错误（谨慎）：" + err);
                            resolve2("错误：异常错误（谨慎）：" +err);
                            // global.reptileCatalog--;
                            // console.log(`success:现在有${global.reptileCatalog}条章节正在爬取`)
                            // console.log(originUrl + catalog.reptileAddress);
                            // let endTime = new Date().getTime();
                            // console.log(`成功响应，开始时间${startTime},结束时间${endTime},耗时${endTime-startTime}毫秒`);
                        }
                    }catch(err){
                        if(start >= 2) {
                            global.reptileCatalog--;
                            // console.log(`catch：现在有${global.reptileCatalog}条章节正在爬取`)
                            log.error(" 错误地址： " + originUrl + catalog.reptileAddress + ",代理IP：" + option.proxy);
                            let endTime = new Date().getTime();
                            log.error(`响应失败,开始时间${startTime},结束时间${endTime},耗时${endTime-startTime}毫秒`);
                            // reject(err);
                            log.error("连接2次都是失败，失败原因：" + err);

                            await db.query(`INSERT INTO progresserror (reptileType, originUrl, bookId, catalogId, reptileAddress, bookName, catalogName) VALUES (${reptileType}, "${originUrl}", ${bookId}, ${catalog.id}, "${catalog.reptileAddress}", "${bookName}", "${catalog.name}")`);
                            resolve2("错误：连接2次都是失败" + err);  //连接5次都是失败   最好不要改，其他程序是判断这几个字的。
                        } else {
                            // log.error("连接" + start + "次都是失败" + err);
                            resolve2(await startRpFn())
                            // let set = setTimeout(() => {
                            //     startRp();
                            //     clearTimeout(set);
                            //     set = null;
                            // }, 200);
                        }
                    }
                });
            }

        }
    });
}

// function hasDir(bookName) {
//     try{
//         tool.hasDir(fs, path.join(__dirname, "../../books/" + bookName))
//         return bookName;
//     }catch(err) {
//         bookName = tool.jiami(bookName);
//         tool.hasDir(fs, path.join(__dirname, "../../books/" + bookName))
//         return bookName;
//     }
// }

async function saveContent(originUrl, bookId, bookName, catalog, noIsRepeat, content,reptileType,uri, tiType) {
    // let filePath = "";
    try {
        // if (noIsRepeat) {
        //     filePath = path.join(__dirname, "../../books/" + bookId + "/" + catalog.id + ".txt");
        // } else {
        //     filePath = tool.isRepeat(fs, path.join(__dirname, "../../books/" + bookId + "/" + catalog.id + ".txt"));
        // }

        let contentSection = tool.handleContent(content);
        // log.info(contentSection.length);
        if(contentSection.length <= 0) {
            let type2 = (await db.query(`select type from catalog where id=${catalog.id}`))[0].type;
            let type = tiType ? ((await db.query(`select type from catalog where id=${catalog.id}`))[0].type == 2?true:false) : false;
            if(type) {  //titype为true且为特殊章节
                contentSection[0] = `提莫淘书，淘你喜欢。提莫淘书，讨你喜欢。<br>来源地址：<a href="${uri}">${catalog.name}</a>`;
            } else {
                await db.query(`INSERT INTO progresserror (reptileType, originUrl, bookId, catalogId, reptileAddress, bookName, catalogName) VALUES (${reptileType}, "${originUrl}", ${bookId}, ${catalog.id}, "${catalog.reptileAddress}", "${bookName}", "${catalog.name}")`);

                log.error("爬取失败，失败原因：没有内容");
                return false;
            }
        }
        let insertSql = `INSERT INTO catalogcontent${await tool.getCatalogNum(catalog.id)} (catalogId, content, bookId, num) VALUES `;
        contentSection.forEach((value, index) => {
            insertSql += `(${catalog.id},"${tool.toSql(value)}", ${bookId},${index}),`;
        });
        insertSql = insertSql.slice(0, insertSql.length - 1);
        // log.info(insertSql);
        // if(noIsRepeat) {
        //     await db.query(`delete from catalogcontent${await tool.getCatalogNum(catalog.id)} where catalogId=${catalog.id}`);
        // } else {}
        await db.query(`delete from catalogcontent${await tool.getCatalogNum(catalog.id)} where catalogId=${catalog.id}`);
        await db.query(insertSql);
        // fs.writeFileSync(filePath, content);
        // wss.broadcast(bookName + "---" + catalog.name + ".txt");
        wss.broadcast(bookName + "---" + catalog.name + "存取成功");
        return true;
    } catch (err) {
        log.error(err);
        return false;
        // let title = tool.jiami(catalog.id);
        // let filePath = "";
        // if(noIsRepeat) {
        //     filePath = path.join(__dirname, "../../books/"+ bookId +"/" + title + ".txt");
        // } else {
        //     filePath = tool.isRepeat(fs, path.join(__dirname, "../../books/"+ bookId +"/" + title + ".txt"));
        // }
        // fs.writeFileSync(filePath, content);
        // wss.broadcast(bookName + "---" + catalog.name + ".txt");
    }
}