var express = require('express');
var router = express.Router();
const { db, tool, log } = require("../../tool/require.js");

router.use('', async function(req, res, next) {
    let userName = tool.getParams(req, 'userName');
    let pwd = tool.getParams(req, 'pwd');
    let data = "";
    try{
        data = await db.query(`select id from users where name="${userName}" limit 0,1`);
    }catch(err){
        res.send(tool.toJson(null, '数据出错', 1002));
        return;
    }

    let userId = data.length > 0 ? data[0].id : '';

    if(userId) {
        let data2 = "";
        try{
            // data2 = await db.query(`select * from users where id=${userId} and pwd="${pwd}" INNER JOIN role on users.roleId = role.id limit 0,1`)
            data2 = await db.query(`select 
                users.id,
                users.name,
                users.pwd,
                users.mobile,
                role.roleName,
                role.permission,
                users.roleId 
                from users INNER JOIN role on users.roleId = role.id where users.id=${userId} and users.pwd='${pwd}' limit 0,1`);
        } catch(err) {
            res.send(tool.toJson(null, `数据出错,出错原因：${err}`, 1002));
            return;
        }

        let user = data2.length > 0 ? data2[0] : '';
        if(user) {
            let token = await tool.token.setToken(user);
            delete user.pwd;

            if(user.permission) {
                if(user.permission == "all") {
                    user.permission = tool.allPermissionList;
                }
                let permission = [];
                let permissionArr = user.permission.split(',');
                permissionArr.forEach((value, index) => {
                    if(value.substr(value.length - 1,value.length) == "0") {
                        permission.push(value);
                    }
                });
                user.permission = permission.join(',');
                res.send(tool.toJson({token:token,user:user}, '登录成功', 1000))
            } else {
                res.send(tool.toJson(null, '你没有权限', 1002))
            }
        } else {
            res.send(tool.toJson(null, '密码错误', 1002))
        }
    } else {
        res.send(tool.toJson(null, '没有该账号', 1002))
    }

});

module.exports = router;
