let tool = require('./tool');

let oauthRouter = function(num) {
    return async function(req, res, next) {
        if(req.query.token || req.body.token) {
            let user = await tool.token.getUser(req.query.token || req.body.token)
            if(user) {
                if(!num || (num && (user.permission.indexOf(num) >=0 || user.permission == "all"))) {
                    req.user = user;
                    req.token = req.query.token || req.body.token;
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


let oauth = (num) =>{
    return oauthRouter(num);
}



module.exports = oauth;