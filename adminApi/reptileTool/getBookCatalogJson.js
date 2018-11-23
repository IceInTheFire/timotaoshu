const {fs, rp, timoRp, cheerio, iconv, path, tool, db, log} = require("../tool/require");
const reptileCommon = require("./common/reptileCommon");

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
    let start = 0;
    startRp();

    async function startRp() {
        start++;
        let option = {
            uri: url,
            encoding: null,
            transform: function (body) {
                // let body2 = iconv.decode(body, 'gbk');  //用来查看页面
                return cheerio.load(iconv.decode(body, reptileCommon[reptileType].code), {decodeEntities: false});
            },
            headers: {
                //模拟谷歌浏览器
                "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36"
            }
        }
        // let ip = await tool.redisData.ipList.getRandomIpList();
        // if(ip) option.proxy = ip;
        global.server && (option.proxy = global.serverProxy);
        timoRp(option).then(async function ($) {
            let title = reptileCommon[reptileType].bookTitle($);
            let author = reptileCommon[reptileType].bookAuthor($);
            let updateTime = reptileCommon[reptileType].getUpdateTime($);
            let bookType = reptileCommon[reptileType].getBookType($);

            let bookStatus = 1;   //1表示连载 2表示完本
            //获取三天之前的时间
            let date = reptileCommon[reptileType].beforeThreeDay();
            if (new Date(updateTime) <= date) {
                bookStatus = 2;
            }
            let count;
            try {
                count = (await db.query(`select count(*) from book where name='${title}' and author='${author}'`))[0]["count(*)"];
            } catch (err) {
                if (errorback) errorback(err);
                return;
            }
            if (count > 0) {
                if (errorback) errorback('本书已存在');
                return;
            }

            let catalogStr = reptileCommon[reptileType].getCatalogList($);
            let catalogArr = [];
            let i = reptileCommon[reptileType].getCatalogFirstNum($), length = catalogStr.length;
            for (i; i < length; i++) {
                catalogArr.push(reptileCommon[reptileType].getCatalog($, catalogStr, i));
            }
            let book = {
                title: title,
                author: author,
                description: reptileCommon[reptileType].getDescription($),
                imgUrl: reptileCommon[reptileType].getBookImgUrl($),
                baseUrl: tool.getHost(url),
                originUrl: url,
                // catalog:catalogArr,
                updateTime: updateTime,
                bookType: bookType,
                bookStatus: bookStatus,
                reptileType: reptileType
            };

            let sql = `INSERT INTO book(name, author, description, reptileType, originUrl, imgUrl, type,updateTime,bookType,bookStatus,isJin) VALUES ('${book.title}','${book.author}','${book.description}', ${book.reptileType},'${book.originUrl}','${book.imgUrl}', 2, date_sub('${book.updateTime}',interval 0 day), '${book.bookType}', ${book.bookStatus},2)`;
            await db.query(sql);

            let bookIdSql = "select id from book where name='" + book.title + "' And author='" + book.author + "'";
            let bookId = tool.getData(await db.query(bookIdSql));

            let catalogSql = "INSERT INTO catalog (bookId, name, num, type, reptileAddress, createTime) VALUES"
            let catalogLength = catalogArr.length;
            catalogArr.forEach((value, index) => {
                catalogSql += "(" + bookId + ", '" + value.title + "'," + index * 2 + ", " + value.type + ", '" + value.href + "', now())"
                if (index == catalogLength - 1) {
                    // catalogSql += "('" + value + "')";
                } else {
                    catalogSql += ",";
                }
            })
            await db.query(catalogSql);

            // saveJson(book)
            if (callback) callback();

        }).catch(function (err) {
            if (start >= 10) {
                if (errorback) errorback(err);
            } else {
                console.log("爬取失败：" + err);
                startRp();
            }
        });
    }
}


// async function saveJson(book) {
//     try{
//         let sql = `select id from book where name='${book.title}' and author='${book.author}'`;
//         let id = (await db.query(sql))[0].id;
//         tool.hasDir(fs, path.join(__dirname, '../../book'))
//         let filePath = tool.isRepeat(fs, path.join(__dirname, '../../book/' + id + ".json"));
//         fs.writeFileSync(filePath,JSON.stringify(book));
//     }catch(err) {
//         log.error(err);
//         // let title = tool.jiami(book.title);
//         // let filePath = tool.isRepeat(fs, path.join(__dirname, '../../book/' + title + ".json"));
//         // fs.writeFileSync(filePath,JSON.stringify(book));
//     }
// }