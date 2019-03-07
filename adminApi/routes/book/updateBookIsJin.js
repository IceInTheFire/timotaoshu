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
    let bookIds = tool.getParams(req, 'bookIds');


    let bookIntIds = [];

    if(!bookId && !bookIds) {
        res.send(tool.toJson(null, 'bookId或bookIds参数不可为空', 1002));
        return;
    }
    if(bookIds) {
        bookIds = bookIds.split(',');
        bookIds.forEach((value, index)=>{
            if(parseInt(value)){    //bookid没有0
                bookIntIds.push(parseInt(value));
            };
        })
        bookIntIds = Array.from(new Set(bookIntIds));       //es6的数组去重
    }
    if(!isJin) {
        res.send(tool.toJson(null, 'isJin参数不可为空', 1002));
        return;
    }

    // let bookName = await db.query(`select book where id=${bookId}`)[0].name;
    if(isJin == "1") {  //启用有限制

        if(bookIds.length > 0) {
            let i = 0, length = bookIntIds.length;
            for(i;i<length;i++) {
                let book = await db.query(`select * from book where id=${bookIntIds[i]}`);
                if(book.length > 0){
                    let count = (await db.query(`select count(*) from progresserror where bookId=${bookIntIds[i]}`))[0]["count(*)"];
                    if(count > 0) {
                        bookIntIds.splice(i,1);
                        i--;
                        length--;
                    }
                }
            }
        } else {    //bookId
            let book = await db.query(`select * from book where id=${bookId}`);
            if(book.length > 0){
                let bookName = book[0].name;
                let count = (await db.query(`select count(*) from progresserror where bookId=${bookId}`))[0]["count(*)"];
                if(count > 0) {
                    res.send(tool.toJson(null, '爬取错误/遗漏列表里有该书的存在', 1002));
                    return;
                }
            }
        }

    }


    try{
        let whereSql = ``;
        let whereSqlArr = [];
        if(bookIntIds.length>0){
            bookIntIds.forEach((value, index) =>{
                whereSqlArr.push(`id=${value}`);
            });
            whereSql = whereSqlArr.join(' or ')
        } else if(bookId) {
            whereSql = `id=${bookId}`;
        } else {
            res.send(tool.toJson(null, '没有修改', 1002));
            return;
        }
        log.info(`update book set isJin=${isJin} where ${whereSql}`);
        await db.query(`update book set isJin=${isJin} where ${whereSql}` );
        if(bookIds.length>0) {

            res.send(tool.toJson(`计划更改${bookIds.length}本书状态，已修改${bookIntIds.length}本书成功，${bookIds.length - bookIntIds.length}本因错误章节或重复原因失败`, null, 1000));
        } else {
            res.send(tool.toJson('修改成功', null, 1000));
        }

    }catch(err) {
        res.send(tool.toJson(null, '修改失败', 1002));
    }


});

module.exports = router;
