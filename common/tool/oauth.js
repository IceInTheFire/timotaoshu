let tool = require('./tool');

let oauthRouter = function(num) {
    return async function(req, res, next) {
        if(req.query.token || req.body.token) {
            let user = await tool.token.getUser(req.query.token || req.body.token)
            if(user) {
                if(!num || (num && (user.permission.indexOf(num) >=0 || user.permission == "all"))) {
                    req.user = user;
                    next();
                } else {
                    res.send(tool.toJson(null,"账号权限不足", 1002));
                }
            } else {
                res.send(tool.toJson(null,"token验证无效", 1003));
            }
        } else {
            res.send(tool.toJson(null,"请填写token参数", 1003));
        }
    }
}

/*
* 类型
* 6、用户
* 5、vip
* 4、管理员      （网站日常运营，一般是h5）
* 3、二级管理员（增加、编辑书）
* 2、一级管理员（爬书、查看所有人权限）
* 1、超级管理员（所有权限）
* 默认6
* */
let oauth = (num) =>{
    return oauthRouter(num);
}



module.exports = oauth;