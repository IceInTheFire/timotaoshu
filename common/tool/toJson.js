const toJson = function(data, msg, code) {
    return JSON.stringify({
        code: code || 1000,
        data: data,
        msg: msg || ''
    });

    /*
    * code
    * 1000   请求接口成功
    * 1002   代码错误，前端直接显示报错信息
    * 1003   token验证失败，前端直接跳转到登录页
    * 1004   权限不够，前端直接跳转到首页
    * */
}



module.exports = toJson;