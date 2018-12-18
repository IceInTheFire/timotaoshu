var express = require('express');
var router = express.Router();
const { oauth, tool,db } = require("../../tool/require");

router.use('', oauth(6103),  async function(req, res, next) {
    let id = tool.getParams(req, 'id');
    let name = tool.getParams(req, 'name');
    let pwd = tool.getParams(req, 'pwd')
    let mobile = tool.getParams(req, 'mobile');
    let roleId = tool.getParams(req, 'roleId');
    if(!id) {
        res.send(tool.toJson(null, "职员id不可为空", 1002));
        return
    } else if(id == "1") {
        res.send(tool.toJson(null, `职员Id为1不允许更改删除`, 1002));
        return;
    } else if(id == "48"){
        res.send(tool.toJson(null, `公开用户不允许更改删除`, 1002));
        return;
    }
    if(!name) {
        res.send(tool.toJson(null, "职员花名不可为空", 1002));
        return
    }
    if(!pwd) {
        res.send(tool.toJson(null, "密码不可为空", 1002));
        return
    }
    if(!mobile) {
        res.send(tool.toJson(null, "手机号不可为空", 1002));
        return
    }
    if(!roleId) {
        res.send(tool.toJson(null, "权限ID不可为空", 1002));
        return
    }
    if(!tool.isMobile(mobile)) {
        res.send(tool.toJson(null, "手机号格式不对", 1002));
        return
    }

    let staff = (await db.query(`select * from users where id=${id}`))[0];

    let nameCount = (await db.query(`select count(*) from users where name="${name}"`))[0]["count(*)"];
    if(staff.name != name && nameCount > 0) {
        res.send(tool.toJson(null, "已有该职员花名存在", 1002));
        return
    }
    let mobileCount = (await db.query(`select count(*) from users where mobile="${mobile}"`))[0]["count(*)"];
    if(staff.mobile != mobile && mobileCount > 0) {
        res.send(tool.toJson(null, "已有该手机存在", 1002));
        return
    }


    // await db.query(`insert into users (name, pwd, mobile, roleId)Values('${name}','${pwd}','${mobile}', ${roleId})`);
    try{
        await db.query(`update users set name="${name}",pwd="${pwd}",mobile="${mobile}",roleId=${roleId} where id=${id}`);
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
                from users INNER JOIN role on users.roleId = role.id where users.id=${id} and users.pwd="${pwd}" limit 0,1`);
        } catch(err) {
            res.send(tool.toJson(null, `数据出错,出错原因：${err}`, 1002));
            return;
        }

        let user = data2.length > 0 ? data2[0] : '';
        if(user) {
            await tool.token.setToken(user);
            res.send(tool.toJson({successMsg:"修改成功"}, '', 1000));
        }
    }catch(err) {
        res.send(tool.toJson(null, `修改失败，失败原因：${err}`, 1002));
    }

});

module.exports = router;
