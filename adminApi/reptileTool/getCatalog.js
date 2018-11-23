const {fs, rp, cheerio, iconv, path, tool, wss, log, db} = require("../tool/require");
let reptileCommon = require("./common/reptileCommon")

module.exports = async (bookId, reptileType, baseUrl, bookName, catalog, noIsRepeat, timeout) => {
    return getCatalog_common(bookId, baseUrl, bookName, catalog, noIsRepeat, parseInt(reptileType), parseInt(timeout) || 10000);
}

async function getCatalog_common(bookId, baseUrl, bookName, catalog, noIsRepeat, reptileType, timeout) {
    return new Promise(async (resolove, reject) => {
        let start = 0;
        startRp();
        global.reptileCatalog++;
        console.log(`当前有${global.reptileCatalog}条章节正在爬取`)
        let startTime = new Date().getTime();
        async function startRp() {
            start++;
            let option = {
                uri:baseUrl + catalog.reptileAddress,
                encoding : null,
                headers:{
                    //模拟谷歌浏览器
                    "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36"
                },
                transform: function(body, response, resolveWithFullResponse) {
                    // return cheerio.load(iconv.decode(body, 'gbk'), {decodeEntities: false});
                    // return [cheerio.load(iconv.decode(body, 'utf-8'), {decodeEntities: false}),iconv.decode(body, 'utf-8')];
                    return [cheerio.load(iconv.decode(body, reptileCommon[reptileType].code), {decodeEntities: false}),iconv.decode(body, reptileCommon[reptileType].code)];
                },
                timeout: timeout
            };
            let ip = await tool.redisData.ipList.getRandomIpList();
            if(ip) option.proxy = ip;
            rp(option).then(function(data) {
                let $ = data[0];
                // let body = data[1];
                let content = "";
                try{
                    content = reptileCommon[reptileType].getCatalogContent($);
                    // bookName = hasDir(bookName);
                }catch(err) {
                    // log.error("我只是看个问题" + bookName + "_" + book.title);
                    log.error(err);
                    db.query(`INSERT INTO progresserror (reptileType, originUrl, bookId, catalogId, reptileAddress, bookName, catalogName) VALUES (${reptileType}, '${baseUrl}', '${bookId}', '${catalog.id}', '${catalog.reptileAddress}', '${bookName}', '${catalog.name}')`);
                }

                try{
                    saveContent(baseUrl, bookId, bookName, catalog, noIsRepeat, content);
                    resolove();
                }catch(err) {
                    // log.info("我只是看个错误");
                    log.error("我只是看个错误:" + err);
                    reject(err);
                }
                global.reptileCatalog--;
                console.log(`当前有${global.reptileCatalog}条章节正在爬取`)
                console.log(baseUrl + catalog.reptileAddress);
                console.log(ip);
                let endTime = new Date().getTime();
                console.log(`成功响应，开始时间${startTime},结束时间${endTime},耗时${endTime-startTime}毫秒`);
            }).catch((err) => {
                if(start >= 5) {
                    global.reptileCatalog--;
                    console.log(`当前有${global.reptileCatalog}条章节正在爬取`)
                    console.log(baseUrl + catalog.reptileAddress);
                    console.log(ip);
                    let endTime = new Date().getTime();
                    console.log(`响应失败,开始时间${startTime},结束时间${endTime},耗时${endTime-startTime}毫秒`);
                    // reject(err);
                    log.error("连接5次都是失败，失败原因：" + err);
                    resolove("连接10次都是失败" + err);  //连接10次都是失败   最好不要改，其他程序是判断这几个字的。
                    db.query(`INSERT INTO progresserror (reptileType, originUrl, bookId, catalogId, reptileAddress, bookName, catalogName) VALUES (${reptileType}, '${baseUrl}', '${bookId}', '${catalog.id}', '${catalog.reptileAddress}', '${bookName}', '${catalog.name}')`);
                } else {
                    // log.error("连接" + start + "次都是失败" + err);
                    startRp();
                    // let set = setTimeout(() => {
                    //     startRp();
                    //     clearTimeout(set);
                    //     set = null;
                    // }, 200);
                }
            });
        }
    });
}

// function hasDir(bookName) {
//     try{
//         tool.hasDir(fs, path.join(__dirname, '../../books/' + bookName))
//         return bookName;
//     }catch(err) {
//         bookName = tool.jiami(bookName);
//         tool.hasDir(fs, path.join(__dirname, '../../books/' + bookName))
//         return bookName;
//     }
// }

function saveContent(baseUrl, bookId, bookName, catalog, noIsRepeat, content) {
    let filePath = "";
    try{
        if(noIsRepeat){
            filePath = path.join(__dirname, '../../books/'+ bookId +'/' + catalog.id + ".txt");
        } else {
            filePath = tool.isRepeat(fs, path.join(__dirname, '../../books/'+ bookId +'/' + catalog.id + ".txt"));
        }
        fs.writeFileSync(filePath, content);
        wss.broadcast(bookName + "---" + catalog.name + ".txt");
    }catch(err) {
        // log.error(err);
        let title = tool.jiami(catalog.id);
        let filePath = "";
        if(noIsRepeat) {
            filePath = path.join(__dirname, '../../books/'+ bookId +'/' + title + ".txt");
        } else {
            filePath = tool.isRepeat(fs, path.join(__dirname, '../../books/'+ bookId +'/' + title + ".txt"));
        }
        fs.writeFileSync(filePath, content);
        wss.broadcast(bookName + "---" + catalog.name + ".txt");
    }
}