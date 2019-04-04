var express = require('express');
var router = express.Router();
const { oauth, tool, db, log } = require("../../tool/require");

/*
*   修改书的描述
*   bookId 章节id
*   description   描述
* */
router.use('', oauth(1102),  async function(req, res, next) {
    let bookId = parseInt(tool.getParams(req, 'bookId'));
    let description = tool.getParams(req, 'description');

    if(!bookId) {
        res.send(tool.toJson(null, 'bookId参数不合法', 1002));
        return;
    }
    if(!description) {
        res.send(tool.toJson(null, 'description参数不可为空', 1002));
        return;
    }

    let bookList = await db.query(`select * from book where id=${bookId}`);
    if(bookList.length > 0){
        let reptileType = bookList[0].reptileType;
        let author = bookList[0].author;
        if(reptileType == 0 && author != req.user.name) {
            res.send(tool.toJson(null, '保存失败， 失败原因：书源来自本站，属于原创小说，而您非该原创小说的作者', 1002));
            return ;
        }
    }

    description = description.replace(`'`, `"`);   //防注入
    try{
        await db.query(`update book set description='${description}' where id=${bookId}` );
        res.send(tool.toJson('修改成功', null, 1000));
    }catch(err) {
        console.error(err);
        res.send(tool.toJson(null, '修改失败', 1002));
    }


});

module.exports = router;
