var express = require('express');
var router = express.Router();
const { oauth, tool, path, fs, log } = require("../../tool/require");

router.use('', oauth(3001),  async function(req, res, next) {

    let logType = parseInt(tool.getParams(req, 'logType'));
    let name = tool.getParams(req, 'name');
    if(!name) {
        res.status(202);
        res.send(tool.toJson(null, 'name不可为空', 1002));
        return;
    }
    let basePath = ''; //读取的地址
    switch(logType){
        case 1://  adminApi访问日志
            basePath = path.join(__dirname, '../../log/adminApi/visit/' + name);
            break;
        case 2://  adminApi打印日志
            basePath = path.join(__dirname, '../../log/adminApi/out/' + name);
            break;
        case 3://  adminApi报错日志
            basePath = path.join(__dirname, '../../log/adminApi/error/' + name);
            break;
        case 4://  h5访问日志
            basePath = path.join(__dirname, '../../log/h5/visit/' + name);
            break;
        case 5://  h5打印日志
            basePath = path.join(__dirname, '../../log/h5/out/' + name);
            break;
        case 6://  h5报错日志
            basePath = path.join(__dirname, '../../log/h5/error/' + name);
            break;
        case 7://  www打印日志
            basePath = path.join(__dirname, '../../log/www/out/' + name);
            break;
        case 8://  www报错日志
            basePath = path.join(__dirname, '../../log/www/error/' + name);
            break;
        default:// adminApi访问日志  默认
            basePath = path.join(__dirname, '../../log/adminApi/visit/' + name);
            break;
    }

    let f = fs.createReadStream(basePath);
    try{
        res.writeHead(200, {
            'Content-Type': 'application/force-download',
            // 'Content-Type' : 'application/octet-stream',
            // 'Content-Disposition': 'attachment; filename=' + name
            'Content-Disposition': 'attachment; filename=log.log'
        });
        f.pipe(res);
    }catch(err) {
        log.error("err");
    }

});

module.exports = router;
