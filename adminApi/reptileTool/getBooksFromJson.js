const {fs, rp, cheerio, iconv, path, tool, db, wss, log} = require("../tool/require");

const clearRepeat = require("./clearRepeat");
const getCatalog = require("./getCatalog");
const getImg = require("./getImg");
// const reptileCommon = require("./common/reptileCommon");
const reptileCommon2 = require("./common/reptileCommon2");


module.exports = getBooksFromJson

async function getBooksFromJson(finish) {

    // clearRepeat();
    // tool.hasDir(fs, path.join(__dirname, "../../books"));
    // let bookJson = fs.readdirSync(path.join(__dirname, "../../book"));
    let bookJson = await db.query(`select * from book where type=2`);
    console.log(`共${bookJson.length}本`);
    let i = 0, length = bookJson.length;
    let bookCount = 0;      //爬完的书数量


    for (i; i < length; i++) {
         await
            getBook(bookJson[i], callback);
         await tool.sleep(5000);
         if(tool.catalogQueue.length() > 5000) {
             await tool.sleep(60000);   //大于一万堵塞1分钟
             log.info(`当前catalogQueue任务有${tool.catalogQueue.length()}条，先休息一分钟`);
         }
    }
    if(length == 0) {
        callback();
    }

    function callback() {
        bookCount++;
        // if(bookCount >= ((length - 2) > 0 ? (length - 2) : 0)) {
        //     finish && finish();
        // }
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
    let originUrlBefore = reptileCommon.originUrlBefore;
    let imgUrl = "";
    if (obj.imgUrl.indexOf("http") === 0) {
        imgUrl = obj.imgUrl;
    } else {
        imgUrl = baseUrl + obj.imgUrl;
    }

    // let description = obj.description;
    // let author = obj.author;
    let bookName = obj.name;
    let originUrl = obj.originUrl;
    // let catalog = obj.catalog;
    let catalog = await db.query(`select * from catalog where bookId=${bookId}`);
    // let originName = obj.originName;  //后期添加笔趣阁

    // let filePath = tool.isRepeat(fs, path.join(__dirname, "../../books/" + bookId));

    // let fubenCount = filePath.split(" - 副本").length - 1;
    // while (fubenCount > 0) {
    //     bookId += " - 副本";
    //     fubenCount--;
    // }
    getImg(bookId, imgUrl);
    await startBook(bookId, author, reptileType, catalog, originUrlBefore == 2 ? baseUrl:originUrl, bookName, callback)
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
        // await tool.sleep(200);
        // console.log("测试下睡眠多久" + new Date().getTime());
    }
    if(!length) {   //避免没有章节的时候，没有进入end，然后造成书本不全。
        await end();
    }

    async function end() {
        responseCount++;
        // console.log(`共${length}章，现响应了${responseCount}章，成功抓取${sucCount}章，失败${errCount}章`);
        log.info(`${bookName}总共${length}章，已响应${responseCount}章，成功爬取${sucCount}章，失败爬取${errCount}章`)
        if (responseCount == length) {
            // await move(json);

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
