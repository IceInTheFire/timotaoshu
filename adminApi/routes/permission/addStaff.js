var express = require('express');
var router = express.Router();
const { oauth, tool,db } = require("../../tool/require");

router.use('', oauth(6102),  async function(req, res, next) {
    let name = tool.getParams(req, 'name');
    let pwd = tool.getParams(req, 'pwd');
    let mobile = tool.getParams(req, 'mobile');
    let roleId = tool.getParams(req, 'roleId');
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
    let nameCount = (await db.query(`select count(*) from users where name='${name}'`))[0]["count(*)"];
    if(nameCount > 0) {
        res.send(tool.toJson(null, "已有该职员花名存在", 1002));
        return
    }
    let mobileCount = (await db.query(`select count(*) from users where mobile='${mobile}'`))[0]["count(*)"];
    if(mobileCount > 0) {
        res.send(tool.toJson(null, "已有该手机存在", 1002));
        return
    }

    try{
        await db.query(`insert into users (name, pwd, mobile, roleId)Values('${name}','${pwd}','${mobile}', ${roleId})`);
        res.send(tool.toJson({successMsg:"添加成功"}, '', 1000));
    }catch(err) {
        res.send(tool.toJson(null, `添加失败，失败原因：${err}`, 1002));
    }

});

module.exports = router;
