var express = require('express');
var router = express.Router();
const { oauth, tool,db } = require("../../tool/require");

router.use('', oauth(6003),  async function(req, res, next) {
    let roleName = tool.getParams(req, 'roleName');
    let id = tool.getParams(req, 'id');
    let permission = tool.getParams(req, 'permission');
    if(!id) {
        res.send(tool.toJson(null, "角色id不可为空", 1002));
        return
    } else if(id == "1") {
        res.send(tool.toJson(null, `角色Id为1不允许更改删除`, 1002));
        return;
    }
    if(!roleName) {
        res.send(tool.toJson(null, "角色名称不可为空", 1002));
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
        await db.query(`update role set roleName="${roleName}",permission="${permission}" where id=${id}`);
        let users = await db.query(`select 
                users.id,
                users.name,
                users.pwd,
                users.mobile,
                role.roleName,
                role.permission,
                users.roleId 
                from users INNER JOIN role on users.roleId = role.id where users.roleId=${id}`);
        let i = 0, length = users.length;
        for(i; i<length; i++) {
            await tool.token.setToken(users[i]);
        }
        res.send(tool.toJson({successMsg:"修改成功"}, '', 1000));
    }catch(err) {
        res.send(tool.toJson(null, `修改失败，失败原因：${err}`, 1002));
    }

});

module.exports = router;
