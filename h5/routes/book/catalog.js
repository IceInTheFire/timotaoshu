var express = require('express');
var router = express.Router();
var common = require('../../tool/common');
const { tool, db, log } = require("../../tool/require");

/* GET home page. */
router.use('', async function(req, res, next) {
    let bookId = req.query.bookId || req.body.bookId;   //书本id
    let page = req.query.page || req.body.page || 1;   //当前几页
    let limit = req.query.limit || req.body.limit || 20;   //每页多少条  默认20条
    let isSort = req.query.isSort || req.body.isSort || 1;   //是否正序   1表示正序  2表示反序

    let params = {
        page:page,
        limit:limit,
        isSort:isSort,
        count:0,
        allPage:0
    };

    let book = {
        name:'没有此书'
    };
    let catalog = [];

    if(bookId) {
        try{
            book = (await db.query(`
                select book.id,book.name,book.author,book.description,book.originUrl,book.bookType,DATE_FORMAT(book.updateTime,'%Y-%m-%d') as updateTime,reptiletool2.name as remark from book inner join reptiletool2 on book.reptileType=reptiletool2.reptileTypeId where book.id=${bookId};
                `))[0];
            params.count = (await db.query(`select count(*) from catalog where bookId=${bookId}`))[0]["count(*)"];
            params.allPage = Math.ceil(params.count/params.limit);

            catalog = await db.query(`select * from catalog where isJin=2 and bookId=${bookId} ORDER BY id ${isSort == 2 ?"desc":"asc" } limit ${(page - 1) * limit},${limit}`);

        } catch(err) {
            // res.render('pages/book/info', { myUrl:'/book/info'});
        }
    }
    let site = {
        id:`${book.id}`,
        title:`${book.name}`,
        keywords:`${book.name}`,
        description:tool.filterHtml(book.description)
    };

    res.render('pages/book/catalog', { myUrl:'/book/catalog', book, catalog,params,site});
});

module.exports = router;
