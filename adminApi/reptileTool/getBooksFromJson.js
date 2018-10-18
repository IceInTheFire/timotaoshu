const {fs, rp, cheerio, iconv, path, tool, db, wss, log} = require("../tool/require");

const clearRepeat = require("./clearRepeat");
const getCatalog = require("./getCatalog");
const getImg = require("./getImg");
const reptileCommon = require("./common/reptileCommon");


module.exports = getBooksFromJson

async function getBooksFromJson(finish) {
    // clearRepeat();
    // tool.hasDir(fs, path.join(__dirname, '../../books'));
    // let bookJson = fs.readdirSync(path.join(__dirname, '../../book'));
    let bookJson = await db.query(`select * from book where type=2`);
    let i = 0, length = bookJson.length;
    let bookCount = 0;      //爬完的书数量

    if(length == 0) {
        callback();
    }
    for (i; i < length; i++) {
        await getBook(bookJson[i], callback);
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
    let baseUrl = reptileCommon[reptileType].baseUrl;
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

    let i = 0, length = catalog.length;

    // let filePath = tool.isRepeat(fs, path.join(__dirname, '../../books/' + bookId));

    // let fubenCount = filePath.split(" - 副本").length - 1;
    // while (fubenCount > 0) {
    //     bookId += ' - 副本';
    //     fubenCount--;
    // }

    getImg(bookId, imgUrl);
    await startBook(bookId, author, reptileType, catalog, i, length, originUrl, bookName, callback)
}

async function startBook(bookId, author, reptileType, catalog, i, length, originUrl, bookName, callback) {
    let responseCount = 0, sucCount = 0, errCount = 0;
    for (i; i < length; i++) {
        tool.catalogQueue.push({
            params: [bookId, reptileType, originUrl, bookName, catalog[i]],
            pro: getCatalog,
            result: async (data) => {
                sucCount++;
                end();
            },
            error: async (data) => {
                errCount++;
                end();
            }
        });
        // await tool.sleep(200);
        // console.log("测试下睡眠多久" + new Date().getTime());
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
                sql = `update book set type=3 where id='${bookId}' and author='${author}'`;
            } else {
                sql = `update book set type=3, isJin=2 where id='${bookId}' and author='${author}'`;
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

/*
* 移动文件
* */
// function move(json) {
//     return new Promise(async (resolve, reject) => {
//         let obj = JSON.parse(fs.readFileSync(path.join(__dirname, '../../book/' + json)));
//         let reptileType = obj.reptileType;
//         let baseUrl = obj.baseUrl;
//         let imgUrl = "";
//         if (obj.imgUrl.indexOf("http") === 0) {
//             imgUrl = obj.imgUrl;
//         } else {
//             imgUrl = baseUrl + obj.imgUrl;
//         }
//         let description = obj.description;
//         let author = obj.author;
//         let bookName = obj.title;
//         let originUrl = obj.originUrl;
//         let catalog = obj.catalog;
//         // let originName = obj.originName;  //后期添加笔趣阁
//
//
//         tool.hasDir(fs, path.join(__dirname, '../../book_end'));
//         let filePath = tool.isRepeat(fs, path.join(__dirname, '../../book_end/' + json));
//         fs.renameSync(path.join(__dirname, '../../book/' + json), filePath);
//
//
//         // let sql = "INSERT INTO book (name, author, description, originUrl, imgUrl) values ('" + bookName + "','" + author + "','" + description + "','" + originUrl + "','" + imgUrl + "')"
//         let errorCount = (await db.query(`select count(*) from progresserror where bookName='${bookName}'`))[0]["count(*)"];
//
//         let sql = ``;
//         if (errorCount <= 0) {
//             sql = `update book set type=3 where name='${bookName}' and author='${author}'`;
//         } else {
//             sql = `update book set type=3, isJin=2 where name='${bookName}' and author='${author}'`;
//         }
//
//         // let bookIdSql = "select id from book where name='" + bookName + "' And author='" + author + "'";
//
//         await db.query(sql);
//         // let bookId = tool.getData(await db.query(bookIdSql));
//         // let catalogSql = "INSERT INTO catalog (bookId, name, num, type, reptileAddress, createTime) VALUES"
//         // let length = catalog.length;
//         // catalog.forEach((value, index) => {
//         //     catalogSql += "(" + bookId + ", '" + value.title + "'," + index * 2 + ", " + value.type + ", '" + value.href + "', now())"
//         //     if (index == length - 1) {
//         //         // catalogSql += "('" + value + "')";
//         //     } else {
//         //         catalogSql += ",";
//         //     }
//         // })
//         // await db.query(catalogSql);
//
//         wss.broadcast(json.split(".")[0] + "全部获取成功");
//         resolve();
//     });
// }