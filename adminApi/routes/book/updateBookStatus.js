var express = require('express');
var router = express.Router();
const { oauth, tool, db, log } = require("../../tool/require");

/*
*   切换章节isJin
*   catalogId 章节id
*   isJin   1禁用  2不禁用
* */
router.use('', oauth(1103),  async function(req, res, next) {
    let bookId = parseInt(tool.getParams(req, 'bookId'));
    let bookStatus = parseInt(tool.getParams(req, 'bookStatus'));

    if(!bookId) {
        res.send(tool.toJson(null, 'bookId参数不可为空', 1002));
        return;
    }
    if(!bookStatus) {
        res.send(tool.toJson(null, 'bookStatus参数不可为空', 1002));
        return;
    }
    if(bookStatus == 1) {
        let reptileTypeId = (await db.query(`select reptileType from book where id=${bookId}`))[0].reptileType;
        let result = (await db.query(`select count(reptileTypeId) from reptiletool2 where reptileTypeId = ${reptileTypeId}`))[0]['count(reptileTypeId)'];
        if(!result) {
            res.send(tool.toJson(null, '该来源渠道不存在，故不能转换为连载状态'));
            return;
        }
    }


    try{
        await db.query(`update book set bookStatus=${bookStatus} where id=${bookId}` );
        res.send(tool.toJson('修改成功', null, 1000));
    }catch(err) {
        res.send(tool.toJson(null, '修改失败', 1002));
    }


});

module.exports = router;
