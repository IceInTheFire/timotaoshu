const {fs, rp, timoRp, cheerio, iconv, path, tool, db, log} = require("../tool/require");
// const reptileCommon = require("./common/reptileCommon");
const reptileCommon2 = require("./common/reptileCommon2");

// module.exports = getBookCatalogJson2;
module.exports = async (reptileType, url, callback, errorback) => {
    var reptileType = parseInt(reptileType);
    return getBookCatalogJson_common(reptileType, url, callback, errorback);
}

/*
* 通过 url 获取
* 获取书的目录
* 并生成json格式
* */
async function getBookCatalogJson_common(reptileType, url, callback, errorback) {
    let reptileCommon = await reptileCommon2(reptileType);
    let start = 0;
    startRp();

    async function startRp() {
        start++;
        let option = {
            uri: url,
            encoding: null,
            transform: function (body) {
                // let body2 = iconv.decode(body, 'gbk');  //用来查看页面
                return cheerio.load(iconv.decode(body, reptileCommon.code), {decodeEntities: false});
            },
            headers: {
                //模拟谷歌浏览器
                "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36"
            }
        }

        if(global.server) {
            option.proxy = global.serverProxy
        }  else {
            let ip = await tool.redisData.ipList.getRandomIpList();
            if(ip) option.proxy = ip;
        }
        timoRp(option).then(async function ($) {
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
                if (errorback) errorback('本书已存在');
                return;
            }

            let description = reptileCommon.getDescription($);
            let imgUrl = reptileCommon.getBookImgUrl($);
            let baseUrl = tool.getHost(url);

            let catalogListUrl = reptileCommon.getCatalogListUrl($);

            if(catalogListUrl) {        //小说目录
                let option = {
                    uri: catalogListUrl,
                    encoding: null,
                    transform: function (body) {
                        // let body2 = iconv.decode(body, 'gbk');  //用来查看页面
                        return cheerio.load(iconv.decode(body, reptileCommon.code), {decodeEntities: false});
                    },
                    headers: {
                        //模拟谷歌浏览器
                        "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36"
                    }
                }
                if(global.server) {
                    option.proxy = global.serverProxy
                }  else {
                    let ip = await tool.redisData.ipList.getRandomIpList();
                    if(ip) option.proxy = ip;
                }
                timoRp(option).then( async ($) => {
                    await getCatalogList($);
                }).catch((err)=>{
                    if (errorback) errorback("访问目录页面错误，错误原因：" + err);
                });
            } else {        //小说详情页有目录
                await getCatalogList($);
            }


            async function getCatalogList($) {
                let catalogStr = reptileCommon.getCatalogList($);
                let catalogArr = [];
                let i = reptileCommon.getCatalogFirstNum($), length = catalogStr.length;
                for (i; i < length; i++) {
                    catalogArr.push(reptileCommon.getCatalog($, catalogStr, i));
                }
                let book = {
                    title: title,
                    author: author,
                    description: description,
                    imgUrl: imgUrl,
                    baseUrl: baseUrl,
                    originUrl: url,
                    // catalog:catalogArr,
                    updateTime: updateTime,
                    bookType: bookType,
                    bookStatus: bookStatus,
                    reptileType: reptileType
                };
                let sql = `INSERT INTO book(name, author, description, reptileType, originUrl, imgUrl, type,updateTime,bookType,bookStatus,isJin) VALUES ("${book.title}","${tool.toSql(book.author)}","${tool.toSql(book.description)}", ${book.reptileType},"${book.originUrl}","${book.imgUrl}", 2, date_sub("${book.updateTime}",interval 0 day), "${book.bookType}", ${book.bookStatus},2)`;
                await db.query(sql);
                let bookIdSql = `select id from book where name="${tool.toSql(book.title)}" And author="${book.author}"`;
                let bookId = tool.getData(await db.query(bookIdSql));

                let catalogSql = `INSERT INTO catalog (bookId, name, num, type, reptileAddress, createTime) VALUES`
                let catalogLength = catalogArr.length;
                catalogArr.forEach((value, index) => {
                    catalogSql += `(${bookId},"${tool.toSql(value.title)}",${index*2},${value.type},"${value.href}", now())`;
                    if (index == catalogLength - 1) {
                        // catalogSql += "('" + value + "')";
                    } else {
                        catalogSql += `,`;
                    }
                })
                await db.query(catalogSql);
                if (callback) callback();
            }

        }).catch(function (err) {
            if (start >= 10) {
                if (errorback) errorback(err);
            } else {
                log.error("爬取失败：" + err);
                startRp();
            }
        });
    }
}
