var express = require('express');
var router = express.Router();
const { db, oauth, tool, log } = require("../../tool/require");

router.use('', oauth(),  async function(req, res, next) {
    // let user = await db.query('select * from users');
    let oldPass = tool.getParams(req, 'oldPass');
    let newPass = tool.getParams(req, 'newPass');
    let rePass = tool.getParams(req, 'rePass');

    if(newPass != rePass) {
        res.send(tool.toJson(null,'两次密码不一致', 1002));
        return;
    }
    if(oldPass != req.user.pwd) {
        res.send(tool.toJson(null,'原密码不正确', 1002));
        return;
    }
    let userId = req.user.id;
    if(userId == "48") {    //给火炎使用
        res.send(tool.toJson(null,'公开用户不允许更改密码', 1002));
        return;
    }
    await db.query(`update users set pwd="${newPass}" where id=${userId}`).catch(() => {
        res.send(tool.toJson(null, '密码修改失败', 1002))
    });
    let data2 = await db.query(`select 
                users.id,
                users.name,
                users.pwd,
                users.mobile,
                role.roleName,
                role.permission,
                users.roleId 
                from users INNER JOIN role on users.roleId = role.id where users.id=${userId} and users.pwd='${newPass}' limit 0,1`);
    let user = data2.length > 0 ? data2[0] : '';
    if(user) {
        await tool.redisData.token.reSetToken(user, req.token);
        delete user.pwd;
        res.send(tool.toJson({user:user}, '密码更改成功', 1000))
    } else {
        res.send(tool.toJson(null, '密码更改失败', 1002))
    }


    // res.send(tool.toJson(req.user, '', 1000));
});

module.exports = router;
