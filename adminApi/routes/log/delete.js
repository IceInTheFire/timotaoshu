var express = require('express');
var router = express.Router();
const { oauth, tool, path, fs, log } = require("../../tool/require");

router.use('', oauth(3002),  async function(req, res, next) {

    let logType = parseInt(tool.getParams(req, 'logType'));
    let nameArr = tool.getParams(req, 'nameArr');

    if(nameArr.indexOf('../') != -1) {
        res.send(tool.toJson(null, 'nameArr参数不对', 1002));
        return;
    }

    let basePath = ''; //读取的地址
    switch(logType){
        case 1://  adminApi访问日志 www
            basePath = path.join(__dirname, '../../log/adminApi/visit/');
            break;
        case 2://  adminApi打印日志 www
            basePath = path.join(__dirname, '../../log/adminApi/out/');
            break;
        case 3://  adminApi报错日志 www
            basePath = path.join(__dirname, '../../log/adminApi/error/');
            break;
        case 4://  h5访问日志       h5
            basePath = path.join(__dirname, '../../log/h5/visit/');
            break;
        case 5://  h5打印日志       h5
            basePath = path.join(__dirname, '../../log/h5/out/');
            break;
        case 6://  h5报错日志       h5
            basePath = path.join(__dirname, '../../log/h5/error/');
            break;
        case 7://  www打印日志      server
            basePath = path.join(__dirname, '../../log/www/out/');
            break;
        case 8://  www报错日志      server
            basePath = path.join(__dirname, '../../log/www/error/');
            break;
        default:// adminApi访问日志  默认     www
            basePath = path.join(__dirname, '../../log/adminApi/visit/');
            break;
    }

    let result = tool.deleteBatch(fs, basePath, nameArr, true);
    if(result) {
        res.send(tool.toJson(result.replace('文件','日志'), '', 1000));
    } else {
        res.send(tool.toJson(null, '没有删除任何日志', 1002));
    }
});

module.exports = router;
