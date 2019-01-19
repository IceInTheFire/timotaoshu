var express = require('express');
var router = express.Router();
const { oauth, tool, db, log } = require("../../tool/require");

/*
*   切换书isJin
*   bookId 书id
*   isJin   1、启用  2、禁用
* */
router.use('', oauth(1102),  async function(req, res, next) {
    let bookId = parseInt(tool.getParams(req, 'bookId'));
    let isJin = parseInt(tool.getParams(req, 'isJin'));

    if(!bookId) {
        res.send(tool.toJson(null, 'bookId参数不可为空', 1002));
        return;
    }
    if(!isJin) {
        res.send(tool.toJson(null, 'isJin参数不可为空', 1002));
        return;
    }

    // let bookName = await db.query(`select book where id=${bookId}`)[0].name;
    if(isJin == "1") {  //启用有限制
        let book = await db.query(`select * from book where id=${bookId}`);
        if(book.length > 0){
            // let bookName = book[0].name;
            let count = (await db.query(`select count(*) from progresserror where bookId=${bookId}`))[0]["count(*)"];
            if(count > 0) {
                res.send(tool.toJson(null, '爬取错误/遗漏列表里有该书的存在', 1002));
                return;
            }
        }

    }


    try{
        await db.query(`update book set isJin=${isJin} where id=${bookId}` );
        res.send(tool.toJson('修改成功', null, 1000));
    }catch(err) {
        res.send(tool.toJson(null, '修改失败', 1002));
    }


});

module.exports = router;
