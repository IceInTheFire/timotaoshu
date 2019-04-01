var express = require('express');
var router = express.Router();
const { oauth, tool, db, log } = require("../../tool/require");

/*
*   name 小说名称
*   bookType 小说类型
*   author 小说作者
*   description 小说描述
* */
router.use('', oauth(8005),  async function(req, res, next) {
    let bookType = tool.getParams(req, 'bookType');
    let id = tool.getParams(req, 'id');
    let description = tool.getParams(req, 'description');
    if(!id) {
        res.send(tool.toJson(null, '小说编号不能为空', 1002));
        return;
    }
    if(!bookType) {
        res.send(tool.toJson(null, '小说类型不能为空', 1002));
        return;
    }
    if(!description) {
        let bookList = await db.query(`select description where id=${id}`);
        if(!bookList.length){
            res.send(tool.toJson(null, '没有该小说id', 1002));
            return;
        }
        description = bookList[0].description;
    }

    try{
        await db.query(`update book set bookType="${bookType}", description="${tool.toSql(description)}" where id=${id} `);
    }catch(err) {
        res.send(tool.toJson(null, '操作失败', 1002));
        return;
    }

    res.send(tool.toJson('操作成功', '', 1000));
});

module.exports = router;
