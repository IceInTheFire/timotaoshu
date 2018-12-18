var express = require('express');
var router = express.Router();
const { oauth, tool,db } = require("../../tool/require");

router.use('', oauth(6104),  async function(req, res, next) {
    let ids = tool.getParams(req, 'ids');
    if(!ids) {
        res.send(tool.toJson(null, "职员ids不可为空", 1002));
        return
    }

    let idsArr = ids.split(',');
    let i = 0, length = idsArr.length;
    for(i; i<length; i++) {
        let id = idsArr[i];
        if(!tool.strIsInt(id)) {
            res.send(tool.toJson(null, `职员ids参数不符合`, 1002));
            return;
        } else if(id == "1") {
            res.send(tool.toJson(null, `职员Id为1不允许更改删除`, 1002));
            return;
        } else if(id =="48") {
            res.send(tool.toJson(null, `公开用户不允许更改删除`, 1002));
            return;
        } else if(id == req.user.id) {
            res.send(tool.toJson(null, `自己不能删除自己`, 1002));
            return;
        }
    }

    try{
        await db.query(`delete from users where id IN(${ids})`);
        idsArr.forEach(async (value, index) => {
             await tool.token.removeToken(value);
        })
        if(length > 1) {
            res.send(tool.toJson({successMsg:"批量删除成功"}, '', 1000));
        } else {
            res.send(tool.toJson({successMsg:"删除成功"}, '', 1000));
        }
    }catch(err) {
        res.send(tool.toJson(null, `删除失败，失败原因：${err}`, 1002));
        return
    }



});

module.exports = router;
