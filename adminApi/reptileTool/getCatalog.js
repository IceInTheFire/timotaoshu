const {fs, rp,timoRp, cheerio, iconv, path, tool, wss, log, db} = require("../tool/require");
// let reptileCommon = require("./common/reptileCommon")


module.exports = async (bookId, reptileType, baseUrl, bookName, catalog, noIsRepeat, timeout,tiType) => {
    return getCatalog_common(bookId, baseUrl, bookName, catalog, noIsRepeat, parseInt(reptileType), parseInt(timeout), tiType);
}

async function getCatalog_common(bookId, baseUrl, bookName, catalog, noIsRepeat, reptileType, timeout, tiType) {
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
                            // return cheerio.load(iconv.decode(body, "gbk"), {decodeEntities: false});
                            // return [cheerio.load(iconv.decode(body, "utf-8"), {decodeEntities: false}),iconv.decode(body, "utf-8")];
                            // console.log(iconv.decode(body, reptileCommon.code));
                            return [cheerio.load(iconv.decode(body, reptileCommon.code), {decodeEntities: false}),iconv.decode(body, reptileCommon.code)];
                        },
                        timeout: timeout || 10000
                    };
                    let ip = await tool.redisData.ipList.getRandomIpList();
                    if(ip) option.proxy = ip;
                    try{
                        let data = await timoRp(option);
                        let $ = data[0];
                        // let body = data[1];
                        let content = "";
                        global.reptileCatalog--;
                        try{
                            content = reptileCommon.getCatalogContent($);
                            let saveSuccess = await saveContent(baseUrl, bookId, bookName, catalog, noIsRepeat, content,reptileType,uri,tiType);
                            if(saveSuccess){
                                resolve2();
                            } else{
                                resolve2("错误：存取失败");
                            }
                        }catch(err) {
                            // log.error("我只是看个问题" + bookName + "_" + book.title);
                            // log.error(err);

                            await db.query(`INSERT INTO progresserror (reptileType, originUrl, bookId, catalogId, reptileAddress, bookName, catalogName) VALUES (${reptileType}, "${baseUrl}", "${bookId}", "${catalog.id}", "${catalog.reptileAddress}", "${bookName}", "${catalog.name}")`);

                            let endTime = new Date().getTime();
                            log.error(`异常失败,开始时间${startTime},结束时间${endTime},耗时${endTime-startTime}毫秒`);
                            log.error(" 错误地址： " + baseUrl + catalog.reptileAddress + ",代理IP：" + ip);
                            log.error("异常错误（谨慎）：" + err);
                            resolve2("错误：异常错误（谨慎）：" +err);
                            // global.reptileCatalog--;
                            // console.log(`success:现在有${global.reptileCatalog}条章节正在爬取`)
                            // console.log(baseUrl + catalog.reptileAddress);
                            // console.log(ip);
                            // let endTime = new Date().getTime();
                            // console.log(`成功响应，开始时间${startTime},结束时间${endTime},耗时${endTime-startTime}毫秒`);
                        }
                    }catch(err){
                        if(start >= 5) {
                            global.reptileCatalog--;
                            // console.log(`catch：现在有${global.reptileCatalog}条章节正在爬取`)
                            log.error(" 错误地址： " + baseUrl + catalog.reptileAddress + ",代理IP：" + ip);
                            let endTime = new Date().getTime();
                            log.error(`响应失败,开始时间${startTime},结束时间${endTime},耗时${endTime-startTime}毫秒`);
                            // reject(err);
                            log.error("连接5次都是失败，失败原因：" + err);

                            await db.query(`INSERT INTO progresserror (reptileType, originUrl, bookId, catalogId, reptileAddress, bookName, catalogName) VALUES (${reptileType}, "${baseUrl}", ${bookId}, ${catalog.id}, "${catalog.reptileAddress}", "${bookName}", "${catalog.name}")`);
                            resolve2("错误：连接5次都是失败" + err);  //连接5次都是失败   最好不要改，其他程序是判断这几个字的。
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

async function saveContent(baseUrl, bookId, bookName, catalog, noIsRepeat, content,reptileType,uri, tiType) {
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
                await db.query(`INSERT INTO progresserror (reptileType, originUrl, bookId, catalogId, reptileAddress, bookName, catalogName) VALUES (${reptileType}, "${baseUrl}", ${bookId}, ${catalog.id}, "${catalog.reptileAddress}", "${bookName}", "${catalog.name}")`);

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