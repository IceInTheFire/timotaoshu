var express = require('express');
var router = express.Router();
const { oauth, tool, db, log } = require("../../tool/require");

/*
*   切换章节isJin
*   catalogId 章节id
*   isJin   1禁用  2不禁用
* */
router.use('', oauth(1104),  async function(req, res, next) {
    let catalogId = parseInt(tool.getParams(req, 'catalogId'));
    let isJin = parseInt(tool.getParams(req, 'isJin'));

    if(!catalogId) {
        res.send(tool.toJson(null, 'catalogId参数不合法', 1002));
        return;
    }
    if(!isJin) {
        res.send(tool.toJson(null, 'isJin参数不合法', 1002));
        return;
    }


    try{
        await db.query(`update catalog set isJin=${isJin} where id=${catalogId}` );
        res.send(tool.toJson('修改成功', null, 1000));
    }catch(err) {
        res.send(tool.toJson(null, '修改失败', 1002));
    }


});

module.exports = router;
