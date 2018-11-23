const {fs, rp,timoRp, path, tool, log,cheerio,iconv, db} = require("../tool/require");
const getImg = require("./getImg");
let reptileCommon = require("./common/reptileCommon");
// module.exports = updateBookInfo2;

module.exports = async (book, bookId, callback, errorback) => {
    var reptileType = parseInt(book.reptileType);
    // if(reptileType === 0) {
    //     return updateBookInfo(book, bookId, callback, errorback);
    // } else if (reptileType === 1) {
    //     return updateBookInfo1(book, bookId, callback, errorback);
    // } else if (reptileType === 2) {
    //     return updateBookInfo2(book, bookId, callback, errorback);
    // } else if (reptileType === 3) {
    //     return updateBookInfo3(book, bookId, callback, errorback);
    // }
    return updateBookInfo_common(reptileType, book, bookId, callback, errorback)
}


async function updateBookInfo_common(reptileType, book, bookId, callback, errorback){
    let start = 0;
    await startRp();
    async function startRp() {
        start++;
        let option = {
            uri:book.originUrl,
            encoding : null,
            transform: function(body) {
                // let body2 = iconv.decode(body, 'utf-8');  //用来查看页面
                return cheerio.load(iconv.decode(body, reptileCommon[reptileType].code),{decodeEntities: false});
            },
            headers:{
                //模拟谷歌浏览器
                "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36"
            }
        };
        // let ip = await tool.redisData.ipList.getRandomIpList();
        // if(ip) option.proxy = ip;
        global.server && (option.proxy = global.serverProxy);
        timoRp(option).then(async function($){
            let updateTime = reptileCommon[reptileType].getUpdateTime($);
            let bookType = reptileCommon[reptileType].getBookType($);
            let bookStatus = 1;   //1表示连载 2表示完本

            let date = reptileCommon[reptileType].beforeThreeDay();
            if(new Date(updateTime) <= date) {
                bookStatus = 2;
            }
            let oldImgUrl = book.imgUrl;
            book.imgUrl = reptileCommon[reptileType].getBookImgUrl($);
            book.updateTime = updateTime;
            book.bookStatus = bookStatus;
            book.bookType = bookType;

            let exists = fs.existsSync(path.join(__dirname, `../../books/${book.id}/logo.png`));

            if(oldImgUrl != book.imgUrl || !exists) {
                let imgUrl = '';
                if (book.imgUrl.indexOf("http") === 0) {
                    imgUrl = book.imgUrl;
                } else {
                    imgUrl = reptileCommon[reptileType].baseUrl + book.imgUrl;
                }
                getImg(bookId, imgUrl);
            }

            await db.query(`update book set updateTime=date_sub('${book.updateTime}',interval 0 day),bookStatus=${book.bookStatus},bookType='${book.bookType}',imgUrl='${book.imgUrl}' where id=${bookId}`);
            // try{
            //     tool.hasDir(fs, path.join(__dirname, '../../book_end'))
            //     fs.writeFileSync(path.join(__dirname, '../../book_end/' + bookId + ".json"),JSON.stringify(book));
            // }catch(err) {
            //     log.error(err);
            //     // book.title = tool.jiami(book.title);
            //     // fs.writeFileSync(path.join(__dirname, '../../book_end/' + bookId+ ".json"),JSON.stringify(book));
            // }
            if(callback) callback(book.imgUrl);
        }).catch(function(err){
            log.error("错误" + start + ":" + err);
            if(errorback) errorback(err);
            if(start >= 10) {
                log.error("错误:" + err);
                if(errorback) errorback(err);
            } else {
                startRp();
            }
        });
    }
}