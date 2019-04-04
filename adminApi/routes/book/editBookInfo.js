var express = require('express');
var router = express.Router();
const { oauth, tool, db, log } = require("../../tool/require");

/*
*   page 页数
*   limit 一页几条
*
* */
router.use('', oauth(1105),  async function(req, res, next) {
    let bookType = tool.getParams(req, 'bookType');
    let id = tool.getParams(req, 'id');
    if(!id) {
        res.send(tool.toJson(null, '小说编号不能为空', 1002));
        return;
    }
    if(!bookType) {
        res.send(tool.toJson(null, '小说类型不能为空', 1002));
        return;
    }

    let bookList = await db.query(`select * from book where id=${id}`);

    if(bookList.length <= 0){
        res.send(tool.toJson(null, '没有这本书', 1002));
        return;
    }
    if(bookList.length > 0){
        let reptileType = bookList[0].reptileType;
        let author = bookList[0].author;
        if(reptileType == 0 && author != req.user.name) {
            res.send(tool.toJson(null, '操作失败， 失败原因：书源来自本站，属于原创小说，而您非该原创小说的作者', 1002));
            return ;
        }
    }

    try{
        await db.query(`update book set bookType="${bookType}" where id=${id} `);
    }catch(err) {
        res.send(tool.toJson(null, '操作失败', 1002));
        return;
    }

    res.send(tool.toJson('操作成功', '', 1000));
});

module.exports = router;
