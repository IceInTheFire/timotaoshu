/*
* 统一获取接口参数，
*
* 同时也为了防止sql注入
*
* 把英文双引号改成了转义的英文双引号,遇到转义符号，先处理转义符号，再处理英文双引号(以前是把英文双引号改成了英文单引号)
*
* sql语法尽量用双引号
*
* notrans 默认false 如果不想转义的话，则设为true ，，一般
* */
function getParams(req, name, notrans){
    let body = (req.query[name] || req.body[name] || '');
    if(!notrans){
        // return body.replace(/"/g,"'");
        return body
            .replace(/\\/g,"\\\\")
            .replace(/"/g,"\\\"");
    }
    return body;
}

module.exports = getParams;