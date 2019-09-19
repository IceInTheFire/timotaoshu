var express = require('express');
var router = express.Router();
const { oauth, tool, db, log, fs, path, rp, cheerio, iconv, wss } = require("../../tool/require");
const updateBookInfo = require("../../reptileTool/updateBookInfo")

router.use('', oauth(1202),  async function(req, res, next) {
    let bookId = parseInt(tool.getParams(req, 'bookId'));
    // let page = req.query.page || req.body.page || 1;
    // let limit = req.query.limit || req.body.limit || 10;
    //
    if(!bookId) {
        res.send(tool.toJson(null, 'bookId不可为空', 1002));
        return;
    }
    let book = await db.query(`select * from book where id=${bookId} and type = 3`);   // type = 3 是爬完的
    if(book.length <= 0) {
        res.send(tool.toJson(null, '该书不存在或者是未爬取状态', 1002));
        return;
    }
    // let book = await db.query(`select * from book`);

    let count = 0;
    try{
        let i = 0, length = book.length;
        for(i; i<length; i++){
            // let json = book[i].id + '.json';
            // let obj = null;
            book[i].isHandle = false;
            try{
                // obj = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../book_end/' + json)));
                // if(!obj.updateTime || !obj.bookStatus || !obj.bookType || !obj.imgUrl || obj.imgUrl == "undefined") {
                count += 1;
                let j = i;
                await updateBookInfo(book[j], book[j].id, function(imgUrl){
                    book[j].isHandle = true;
                    book[j].imgUrl = imgUrl;
                    count -=1;
                    if(!count) {  //coount == 0
                        res.send(tool.toJson({
                            book,
                        }, '', 1000));
                    }
                }, function(err) {
                    book[j].isHandle = JSON.stringify(err);
                });
                wss.broadcast(JSON.stringify(book[j]));
                // }
            }catch(err) {
                // log.error(err);
                res.send(null, err, 1002);
                throw err;
                return;
            }
        }
    } catch(err) {
        res.send(null, err, 1002);
        return;
    }
});

module.exports = router;


// async function updateBookInfo(book, bookId, callback, errorback){
//     await rp({
//         uri:book.originUrl,
//         encoding : null,
//         transform: function(body) {
//             // let body2 = iconv.decode(body, 'gbk');  //用来查看页面
//             return cheerio.load(iconv.decode(body, 'gbk'),{decodeEntities: false});
//         },
//     }).then(async function($){
//         let updateTime2 =  $("#info>p").eq(2).html();
//         let updateTime = updateTime2.split("：").length <=1? updateTime2: updateTime2.split("：")[1];
//         let bookType = ((typeof $(".con_top").html().split(" > ")[1]) == "string") ? $(".con_top").html().split(" > ")[1].trim() : '';
//         let bookStatus = 1;   //1表示连载 2表示完本
//         if(new Date(updateTime) <= new Date("2018")) {
//             bookStatus = 2;
//         }
//         let oldImgUrl = book.imgUrl;
//         book.imgUrl = $("#fmimg>img").attr("src");
//         book.updateTime = updateTime;
//         book.bookStatus = bookStatus;
//         book.bookType = bookType;
//
//         if(oldImgUrl != book.imgUrl) {
//             getImg(book.title, book.baseUrl + book.imgUrl);
//         }
//
//         await db.query(`update book set updateTime=date_sub('${book.updateTime}',interval 0 day),bookStatus=${book.bookStatus},bookType='${book.bookType}',imgUrl='${book.imgUrl}' where id=${bookId}`);
//         try{
//             tool.hasDir(fs, path.join(__dirname, '../../../book_end'))
//             fs.writeFileSync(path.join(__dirname, '../../../book_end/' + book.title + ".json"),JSON.stringify(book));
//         }catch(err) {
//             book.title = tool.jiami(book.title);
//             fs.writeFileSync(path.join(__dirname, '../../../book_end/' + book.title + ".json"),JSON.stringify(book));
//         }
//         if(callback) callback(book.imgUrl);
//     }).catch(function(err){
//         if(errorback) errorback(err);
//     });
// }


/*
* 得到图片
* */
// function getImg(bookName, imgUrl){
//     try{
//         tool.hasDir(fs, path.join(__dirname, '../../../books/' + bookName))
//     }catch(err) {
//         bookName = tool.jiami(bookName);
//         tool.hasDir(fs, path.join(__dirname, '../../../books/' + bookName))
//     }
//     rp({
//         uri: imgUrl,
//         encoding : "binary"
//     }).then(function(imgData){
//         let filePath = tool.isRepeat(fs, path.join(__dirname, '../../../books/' + bookName + '/logo.png'));
//         fs.writeFileSync(filePath, imgData, "binary");
//     }).catch(function(err){
//     });
// }
