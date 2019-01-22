var express = require('express');
var router = express.Router();
// var common = require('../../tool/common');
const { tool, db, log } = require("../../tool/require");

/* GET home page. */
router.use('', async function(req, res, next) {
    let bookId = req.query.bookId || req.body.bookId;
    let toBack = req.query.toBack || req.body.toBack || '';   //为true则是history.backtoBack()  为false则是进入书架
    let bookIds = req.cookies.bookIds || '';
    let isInBook = false;  //默认   不在书架里

    bookId = parseInt(bookId);
    if(bookId!= 0 && !bookId){
        req.h5Error = {
            message:'bookId参数不正确'
        }
        next();
        return;
    }
    if(bookIds.indexOf(bookId) != -1) {
        isInBook = true;
    }
    let book = {
        name:'没有此书'
    };
    let catalog = [];
    let otherBook = [];
    if(bookId) {
        try{
            book = (await db.query(`
                select book.id,book.name,book.author,book.description,book.originUrl,book.bookType,DATE_FORMAT(book.updateTime,'%Y-%m-%d') as updateTime,reptiletool2.name as remark from book inner join reptiletool2 on book.reptileType=reptiletool2.reptileTypeId where book.id=${bookId};
                `))[0];
            let description = "<p>";
            description += book.description.replace("<br/>","<br>").split("<br>").join("</p><p>");
            description += "</p>";
            book.description = description;

            catalog = await db.query(`select * from catalog where isJin=2 and bookId=${bookId} ORDER BY id desc limit 10 `);
            otherBook = await db.query(`select * from book where id!=${bookId} and author="${book.author}" and isJin=1`);
        } catch(err) {
            // next(createError(err));
            log.error(err);
            req.h5Error = {
                err:err,
                message:'报错信息：搜索出错'
            }
            next();
            return;
            // res.render('pages/book/info', { myUrl:'/book/info'});
        }
    }

    let site = {
        id:`${book.id}`,
        title:`${book.name}`,
        keywords:`${book.name}`,
        description:tool.filterHtml(book.description)
    };
    res.render('pages/book/info', { myUrl:'/book/info', book, catalog, otherBook,isInBook, site,toBack});
});

module.exports = router;
