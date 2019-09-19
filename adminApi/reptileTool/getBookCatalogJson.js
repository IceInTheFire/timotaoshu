const {fs, rp, timoRp, cheerio, iconv, path, tool, db, log} = require("../tool/require2");
// const reptileCommon = require("./common/reptileCommon");
const reptileCommon2 = require("./common/reptileCommon2");
const getCatalogList = require('./getCatalogList');

// module.exports = getBookCatalogJson2;
module.exports = async (reptileType, url, callback, errorback) => {
    var reptileType = parseInt(reptileType);
    return await getBookCatalogJson_common(reptileType, url, callback, errorback);
}

/*
* 通过 url 获取
* 获取书的目录
* 并生成json格式
* */
async function getBookCatalogJson_common(reptileType, url, callback, errorback) {
    let reptileCommon = await reptileCommon2(reptileType);


    await startRp();

    async function startRp() {
        let result = null;
        let start = 0;
        let error = null;
        while(!result && start<=5) {
            let bodyTest = "";
            let option = {
                uri: url,
                userAgent: reptileCommon.userAgent,
                encoding: null,
                transform: function (body) {
                    // let body2 = iconv.decode(body, "gbk");  //用来查看页面
                    bodyTest = iconv.decode(body, reptileCommon.codeTransform);
                    return cheerio.load(iconv.decode(body, reptileCommon.code), {decodeEntities: false});
                }
            }
            try{
                let $ = await timoRp(option);
                let title = reptileCommon.bookTitle($);
                let author = reptileCommon.bookAuthor($);
                let updateTime = reptileCommon.getUpdateTime($);
                let bookType = reptileCommon.getBookType($);
                let bookStatus = 1;   //1表示连载 2表示完本
                //获取三天之前的时间
                let date = reptileCommon.beforeThreeDay();
                if (new Date(updateTime) <= date) {
                    bookStatus = 2;
                }
                let count;
                try {
                    count = (await db.query(`select count(*) from book where name="${title}" and author="${author}"`))[0]["count(*)"];
                } catch (err) {
                    if (errorback) errorback(err);
                    return;
                }
                if (count > 0) {
                    if (errorback) errorback("本书已存在");
                    return;
                }

                let description = reptileCommon.getDescription($);
                let imgUrl = reptileCommon.getBookImgUrl($);
                let baseUrl = tool.getHost(url);

                let catalogListUrl = reptileCommon.getCatalogListUrl($);
                let book = { title, author, description, imgUrl, baseUrl, url, updateTime, bookType, bookStatus, reptileType };
                if(catalogListUrl) {        // 小说目录地址
                    let option2 = {
                        uri: catalogListUrl,
                        userAgent: reptileCommon.userAgent,
                        encoding: null,
                        transform: function (body) {
                            // let body2 = iconv.decode(body, "gbk");  //用来查看页面
                            return cheerio.load(iconv.decode(body, reptileCommon.code), {decodeEntities: false});
                        }
                    }
                    try{
                        let $2 = await timoRp(option2);
                        result = await getCatalogList({$:$2, reptileCommon, callback, book});
                    }catch(err){
                        throw new Error(`访问目录页面错误，错误原因：${err}，失败地址：${catalogListUrl},代理地址：${option2.proxy}`);
                    }
                } else {        // 小说详情页有目录
                    result = await getCatalogList({$, reptileCommon, callback, book});
                }
            }catch(err){
                start++;
                if(err.toString().indexOf('Error: 访问目录页面错误') === 0) {
                    log.error(err);
                } else {
                    log.error(`第${start}次爬取失败：${err}。失败地址：${url}，body：${bodyTest}`);
                }
                error = err;
                result = null;
            }
        }


       if(!result){
           if (errorback) errorback(error);
       }
    }
}