const {fs, rp,timoRp, path, tool, db, cheerio, iconv, log} = require("../tool/require");

const getCatalog = require("./getCatalog");
// let reptileCommon = require("./common/reptileCommon");
let reptileCommon2 = require("./common/reptileCommon2");


module.exports = async (sqlBook) => {
    var reptileType = parseInt(sqlBook.reptileType);
    // if (reptileType === 0) {
    //     return updateBookNewCatalog(sqlBook, reptileType);
    // } else if (reptileType === 1) {
    //     return updateBookNewCatalog1(sqlBook, reptileType);
    // } else if (reptileType === 2) {
    //     return updateBookNewCatalog2(sqlBook, reptileType);
    // } else if (reptileType === 3) {
    //     return updateBookNewCatalog3(sqlBook, reptileType);
    // }
    if(!global.updateBookIds){
        global.updateBookIds = [];
    } else if(global.updateBookIds.indexOf(sqlBook.id) != -1) {
        return false;   //正在更新的小说
    }
    global.updateBookIds.push(sqlBook.id);

    return updateBookNewCatalog_common(sqlBook, reptileType, end);

    async function end(){
        global.updateBookIds.splice(global.updateBookIds.indexOf(sqlBook.id),1);
    }

}

async function updateBookNewCatalog_common(sqlBook, reptileType, end) {
    let reptileCommon = await reptileCommon2(reptileType);
    return new Promise(async (resolve, reject) => {
        let start = 0;
        await startRp();

        async function startRp() {
            start++;
            let option = {
                uri: sqlBook.originUrl,
                encoding: null,
                transform: function (body) {
                    // let body2 = iconv.decode(body, "gbk");  //用来查看页面
                    return cheerio.load(iconv.decode(body, reptileCommon.code), {decodeEntities: false, xmlMode: true});
                },
                headers: {
                    //模拟谷歌浏览器
                    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36"
                },
                timeout:10000
            };
            if(global.server) {
                option.proxy = global.serverProxy;  //轻盈代理
            }  else {
                let ip = await tool.redisData.ipList.getRandomIpList();
                if(ip) option.proxy = ip;
            }
            try{
                let $ = await timoRp(option);
                let catalogListUrl = reptileCommon.getCatalogListUrl($);
                let updateTime = new Date(reptileCommon.getUpdateTime($)).getTime();
                if(catalogListUrl) {        //小说目录
                    let option2 = {
                        uri: catalogListUrl,
                        encoding: null,
                        transform: function (body) {
                            // let body2 = iconv.decode(body, "gbk");  //用来查看页面
                            return cheerio.load(iconv.decode(body, reptileCommon.code), {decodeEntities: false});
                        },
                        headers: {
                            //模拟谷歌浏览器
                            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36"
                        }
                    }
                    if(global.server) {
                        option2.proxy = global.serverProxy
                    }  else {
                        let ip = await tool.redisData.ipList.getRandomIpList();
                        if(ip) option2.proxy = ip;
                    }
                    try{
                        let $2 = await timoRp(option2);
                        await getCatalogList($2);
                    }catch(err){
                        if (start >= 5) {
                            log.error(`获取${sqlBook.originUrl}5次失败，最后一次失败原因：${err}`);
                            // reject(err);
                            end();
                            reject(`获取${sqlBook.originUrl}5次失败，最后一次失败原因：${err}`);
                        } else {
                            await startRp();
                        }
                    }
                } else {        //小说详情页有目录
                    await getCatalogList($);
                }



                async function getCatalogList($){
                    let firstNum = reptileCommon.getCatalogFirstNum($);
                    let nowCatalog = reptileCommon.getCatalogList($);
                    nowCatalog.splice(0, firstNum);    //截去前面几个
                    /*
                    * 更新的长度
                    * */
                    let upDateLength = nowCatalog.length;
                    /*
                    * sql里存储的长度
                    * */
                    let nowLength = (await db.query(`select count(*) from catalog where bookId=${sqlBook.id} and isReptileTool=2`))[0]["count(*)"];
                    let book = Object.assign({},sqlBook);

                    book.updateTime = book.updateTime.getTime();
                    // let book = {};
                    // try {
                    //     book = JSON.parse(fs.readFileSync(path.join(__dirname, `../../book_end/${sqlBook.name}.json`), "utf-8").toString());
                    // } catch (err) {
                    //     log.error(err);
                    //     book = JSON.parse(fs.readFileSync(path.join(__dirname, `../../book_end/${tool.jiami(sqlBook.name)}.json`), "utf-8").toString());
                    // }

                    /*
                      * 修改书的更新状态
                      * */
                    let date = new Date(reptileCommon.beforeThreeDay()).getTime();
                    // let updateTimeDate = new Date(updateTime).getTime();  //时间类型的刘改时间
                    if (book.updateTime != updateTime  || updateTime <= date) {
                        // if(true) {  //只是暂时的，下次看到就把这行去掉，恢复上面那一行
                        book.updateTime = updateTime;
                        if (updateTime <= date) {
                            book.bookStatus = 2;
                        } else {
                            book.bookStatus = 1;
                        }
                        let bookSql = `update book set updateTime=date_sub("${new Date(book.updateTime).Format("yyyy-MM-dd hh:mm:ss")}",interval 0 day), bookStatus=${book.bookStatus} where id=${sqlBook.id}`;
                        await db.query(bookSql);
                    }


                    // log.info(upDateLength - nowLength > 0);
                    if (upDateLength - nowLength > 0) {
                        // let i = nowLength, length = nowCatalog.length;
                        // for (i; i < length; i++) {
                        //     book.catalog.push(reptileCommon2(reptileType).getCatalog($, nowCatalog, i))
                        // }
                        // saveJson(sqlBook.id, book);
                        let catalogSql = "INSERT INTO catalog (bookId, name, num, type, createTime, reptileAddress) VALUES"
                        /*
                        * 本地json存储的长度
                        * */
                        // let length2 = upDateLength;
                        let ii = nowLength;
                        for (ii; ii < upDateLength; ii++) {
                            let value = reptileCommon.getCatalog($, nowCatalog, ii);
                            catalogSql += `(${book.id},"${value.title}",${ii*2},${value.type}, now(),"${value.href}")`;
                            if (ii == upDateLength - 1) {
                                // catalogSql += `(${value})`;
                            } else {
                                catalogSql += ",";
                            }
                        }
                        await db.query(catalogSql);
                        book.catalog = await db.query(`select * from catalog where bookId=${book.id}`)
                        let start = nowLength;
                        for (start; start < upDateLength; start++) {
                            let value = book.catalog[start];
                            // getCatalog(reptileType, book.originUrl, book.title, value, true);
                            tool.catalogQueue.push({
                                params: [sqlBook.id, reptileType, book.originUrl, book.title, value, true],
                                pro: getCatalog,
                                result: async (data) => {
                                    // sucCount++;
                                    // end();
                                },
                                error: async (data) => {
                                    // errCount++;
                                    // end();
                                }
                            });
                        }
                    } else {
                        // saveJson(sqlBook.id, book);
                    }
                    end();
                    resolve(upDateLength - nowLength);  //返回更新的数据
                }
            }catch(err){
                if (start >= 5) {
                    log.error(`获取${sqlBook.originUrl}5次失败，最后一次失败原因：${err}`);
                    // reject(err);
                    end();
                    reject(`获取${sqlBook.originUrl}5次失败，最后一次失败原因：${err}`);
                } else {
                    await startRp();
                }
            }
        }
    });
}


function saveJson(bookId, book) {
    try {
        tool.hasDir(fs, path.join(__dirname, "../../book_end"))
        let filePath = path.join(__dirname, "../../book_end/" + bookId + ".json");
        fs.writeFileSync(filePath, JSON.stringify(book));
    } catch (err) {
        log.error(err);
        // let title = tool.jiami(book.title);
        // let filePath = path.join(__dirname, "../../book_end/" + title + ".json")
        // fs.writeFileSync(filePath, JSON.stringify(book));
    }
}