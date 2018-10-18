var express = require('express');
var router = express.Router();
var common = require('../../tool/common');
const { tool, db, log,path,fs } = require("../../tool/require");

/* GET home page. */
router.use('', async function(req, res, next) {


    // let bookIds = "1336,1337,1439,1338,1342,1344,1345,1346,1349,1350,1353";
    // let result = await common.listBatch('1', bookIds, '');
    //
    // if(typeof result == "object" && result.error) {
    //     result = {
    //         book:[]
    //     };
    // } else if (typeof result == "object") {
    //     let i = 0, length = result.book.length;
    //     for(i; i<length; i++) {
    //         let book = result.book[i];
    //         if(book.msg == "没有此书") {
    //             result.book.splice(i,1);
    //             i--;
    //             length--;
    //         }
    //     }
    // } else{
    //     result = {
    //         book:[]
    //     };
    // }
    //
    //
    // res.render('pages/home/index', { myUrl:'/home/index',bookList: result.book });

    /*
    * 随机一个id 然后取大于这个id的100条 这100条在代码里随机10条
    * */

    // isJin=1 是启用   type=3是爬完了
//     let book = await db.query(`SELECT * FROM book WHERE isJin = 1 and type = 3 and id >=
// 	((SELECT MAX(id) FROM book where isJin = 1 and type = 3)-(SELECT MIN(id) FROM book where isJin = 1 and type = 3)) * RAND() + (SELECT MIN(id) FROM book where isJin = 1 and type = 3)  LIMIT 10;
// `);

    let book = await db.query(`SELECT * FROM book where isJin = 1 and type = 3 ORDER BY RAND() LIMIT 10`)

    res.render('pages/home/index', { myUrl:'/home/index',bookList: book });
});

module.exports = router;
