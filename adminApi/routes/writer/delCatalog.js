var express = require('express');
var router = express.Router();
const { oauth, tool, db, log } = require("../../tool/require");

/*
*   添加和编辑章节接口
*   id   章节id
*   num  章节排序
*   bookId 小说id
* */
router.use('', oauth(8004),  async function(req, res, next) {
    let id = tool.getParams(req, 'id');
    let num = tool.getParams(req, 'num');
    let bookId = tool.getParams(req, 'bookId');

    if(!id){
        res.send(tool.toJson(null, '章节ID不能为空', 1002));
        return;
    }
    if(!num){
        res.send(tool.toJson(null, '章节NUM不能为空', 1002));
        return;
    }
    if(!bookId){
        res.send(tool.toJson(null, '小说id不能为空', 1002));
        return;
    }

    let book = await db.query(`select author from book where id=${bookId} and type=4`);     //type等于4是本站来源
    if(!book.length){
        res.send(tool.toJson(null, '没有该小说ID，请核对', 1002));
        return;
    }
    let author = book[0].author;

    if(!author){
        res.send(tool.toJson(null, '小说作者不能为空', 1002));      //不可能进来
        return;
    } else if(author != req.user.name){
        res.send(tool.toJson(null, '您不是该小说的作者，故不能添加章节', 1002));
        return;
    }





    try{
        let result = await db.query(`delete from catalog where bookId=${bookId} and num=${num} and id=${id}`);
        console.log(result);
        res.send(tool.toJson("你的章节删除成功", null, 1000));
    } catch(err) {
        res.send(tool.toJson(null, "你的章节删除失败", 1002));
    }


});

module.exports = router;
