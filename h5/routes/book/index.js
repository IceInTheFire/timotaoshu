var express = require('express');
var router = express.Router();
var common = require('../../tool/common');

/* GET home page. */
router.use('', async function(req, res, next) {


    // res.cookie('user', 'lililiwen');
    // console.log(req.cookies.user);
    let type = "1";
    let bookIds = req.cookies.bookIds || '';
    // let bookIds = "1336,1337,1338,1342,1344,1345,1346,1349,1350,1353";
    let result = await common.listBatch(type, bookIds, '');


    if(typeof result == "object" && result.error) {
        res.render('pages/book/index', { myUrl:'/book/index', error: result.error });
        return;
    } else if (typeof result == "object") {
        let i = 0, length = result.book.length;
        for(i; i<length; i++) {
            let book = result.book[i];
            if(book.msg == "没有此书") {
                result.book.splice(i,1);
                i--;
                length--;
            }
        }
        res.render('pages/book/index', { myUrl:'/book/index', list: result.book });
        return;
    } else{
        res.render('pages/book/index', { myUrl:'/book/index', error: "未知错误" });
        return;
    }
});

module.exports = router;
