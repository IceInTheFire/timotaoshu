var express = require('express');
var router = express.Router();
// var common = require('../../tool/common');
const { tool, db, log } = require("../../tool/require");

/* GET home page. */
router.use('', async function(req, res, next) {
    let bookName = req.query.bookName || req.body.bookName;

    let bookList = [];
    if(bookName) {
        // isJin=1 是启用   type=3是爬完了
        bookList = await db.query(`select * from book where name like '%${bookName}%' and isJin=1 and (type = 3 or type = 4)`);
    } else {

    }

    // bookList.forEach((value, index) => {
    //     let description = "<p>";
    //     description += value.description.replace("<br/>","<br>").split("<br>").join("</p><p>");
    //     description += "</p>";
    //     value.description = description;
    // });

    // res.send(tool.toJson(bookList, '', 1000));

    res.render('pages/book/search', { myUrl:'/book/search',bookName,bookList});
});

module.exports = router;
