const {fs, rp, cheerio, iconv, path, tool, db, wss, log} = require("../tool/require");

const clearRepeat = require("./clearRepeat");
const getCatalog = require("./getCatalog");
const getImg = require("./getImg");
// const reptileCommon = require("./common/reptileCommon");
const reptileCommon2 = require("./common/reptileCommon2");


module.exports = getBooksFromJson

async function getBooksFromJson(finish) {

    let bookJson = await db.query(`select * from book where type=2`);
    let i = 0, length = bookJson.length;
    let bookCount = 0;      //爬完的书数量


    for (i; i < length; i++) {
        await getBook(bookJson[i], callback);
        await tool.sleep(5000);
    }
    if(length == 0) {
        callback();
    }

    function callback() {
        bookCount++;
        if (bookCount >= length) {
            log.info(`${length}本书已爬完`);
            finish && finish();
        }
    }
}


async function getBook(obj, callback) {
    let bookId = obj.id;
    let author = obj.author;
    let reptileType = obj.reptileType;
    let reptileCommon = await reptileCommon2(reptileType);
    let baseUrl = reptileCommon.baseUrl;
    let imgUrl = "";
    if (obj.imgUrl.indexOf("http") === 0) {
        imgUrl = obj.imgUrl;
    } else {
        imgUrl = baseUrl + obj.imgUrl;
    }

    let bookName = obj.name;
    let originUrl = obj.originUrl;
    let catalog = await db.query(`select * from catalog where bookId=${bookId}`);
    getImg(bookId, imgUrl);
    await startBook(bookId, author, reptileType, catalog, originUrl, bookName, callback)
}

async function startBook(bookId, author, reptileType, catalog, originUrl, bookName, callback) {
    let responseCount = 0, sucCount = 0, errCount = 0, i = 0, length = catalog.length;
    for (i; i < length; i++) {
        // let f = i;
        tool.catalogQueue.push({
            params: [bookId, reptileType, originUrl, bookName, catalog[i]],
            pro: getCatalog,
            result: async (data) => {
                sucCount++;
                await end();
            },
            error: async (data) => {
                errCount++;
                await end();
            }
        });
    }
    if(!length) {   //避免没有章节的时候，没有进入end，然后造成书本不全。
        await end();
    }

    async function end() {
        responseCount++;
        log.info(`${bookName}总共${length}章，已响应${responseCount}章，成功爬取${sucCount}章，失败爬取${errCount}章`)
        if (responseCount == length) {

            /*
            * 已爬取完，更改爬取状态 start
            * */
            let errorCount = (await db.query(`select count(*) from progresserror where bookId=${bookId}`))[0]["count(*)"];
            let sql = ``;
            if (errorCount <= 0) {
                sql = `update book set type=3, isJin=1 where id="${bookId}" and author="${author}"`;
            } else {
                sql = `update book set type=3, isJin=2 where id="${bookId}" and author="${author}"`;
            }
            await db.query(sql);
            /*
           * 已爬取完，更改爬取状态 end
           * */

            if (callback) {
                callback()
            }
        }
    }
}
