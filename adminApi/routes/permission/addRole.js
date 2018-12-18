var express = require('express');
var router = express.Router();
const { oauth, tool,db } = require("../../tool/require");

router.use('', oauth(6002),  async function(req, res, next) {
    let roleName = tool.getParams(req, 'roleName');
    let permission = tool.getParams(req, 'permission');
    if(!roleName) {
        res.send(tool.toJson(null, "角色名称不可为空", 1002));
        return
    }

    let roleNameCount = (await db.query(`select count(*) from role where roleName="${roleName}"`))[0]["count(*)"];
    if(roleNameCount > 0) {
        res.send(tool.toJson(null, "已有该角色名存在", 1002));
        return
    }


    let permissionArr = permission.split(',');
    let i = 0, length = permissionArr.length;
    for(i; i<length; i++) {
        let value = permissionArr[i];
        if(!tool.strIsInt(value)) {
            res.send(tool.toJson(null, `角色权限参数不符合`, 1002));
            return;
        }
    }

    try{
        await db.query(`insert into role (roleName, permission)Values("${roleName}","${permission}")`);
        res.send(tool.toJson({successMsg:"添加成功"}, '', 1000));
    }catch(err) {
        res.send(tool.toJson(null, `添加失败，失败原因：${err}`, 1002));
    }

});

module.exports = router;
