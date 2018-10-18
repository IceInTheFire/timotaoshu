var express = require('express');
var router = express.Router();
const {oauth, tool, db, log, fs, path} = require("../../tool/require");

/*
*   page 页数
*   limit 一页几条
*
* */
router.use('', oauth(3003), async function (req, res, next) {

    let logType = parseInt(tool.getParams(req, 'logType')) || 1;
    let page = parseInt(tool.getParams(req, 'page')) || 1;
    let limit = parseInt(tool.getParams(req, 'limit')) || 20;

    hasDir(); //判断有没有。有的话，就不理会，没有的话，新建文件夹
    let basePath = ''; //读取的地址
    switch(logType){
        case 1://  adminApi访问日志     www
            basePath = path.join(__dirname, '../../log/adminApi/visit/');
            break;
        case 2://  adminApi打印日志     www
            basePath = path.join(__dirname, '../../log/adminApi/out/');
            break;
        case 3://  adminApi报错日志     www
            basePath = path.join(__dirname, '../../log/adminApi/error/');
            break;
        case 4://  h5访问日志   h5
            basePath = path.join(__dirname, '../../log/h5/visit/');
            break;
        case 5://  h5打印日志   h5
            basePath = path.join(__dirname, '../../log/h5/out/');
            break;
        case 6://  h5报错日志   h5
            basePath = path.join(__dirname, '../../log/h5/error/');
            break;
        case 7://  www打印日志   server
            basePath = path.join(__dirname, '../../log/www/out/');
            break;
        case 8://  www报错日志   server
            basePath = path.join(__dirname, '../../log/www/error/');
            break;
        default:// adminApi访问日志  默认     www
            basePath = path.join(__dirname, '../../log/adminApi/visit/');
            break;
    }

    // let arr = fs.readdirSync(basePath);
    let arrList = fs.readdirSync(basePath);

    let count = arrList.length;
    let i = (page - 1) * limit > count ? count : ((page - 1) * limit),
        length = page * limit > count ? count : (page * limit);
    let list = [];
    for (i; i < length; i++) {
        list.push({
            index:i,
            logType:logType,
            name:arrList[i]
        });
    }


    let logList = {
        count: count,
        list: list,
    }

    res.send(tool.toJson(logList, '', 1000));


    function hasDir(){
        tool.hasDir(fs, path.join(__dirname, '../../log/'));
        tool.hasDir(fs, path.join(__dirname, '../../log/adminApi/'));
        tool.hasDir(fs, path.join(__dirname, '../../log/adminApi/visit/'));
        tool.hasDir(fs, path.join(__dirname, '../../log/adminApi/out/'));
        tool.hasDir(fs, path.join(__dirname, '../../log/adminApi/error/'));
        tool.hasDir(fs, path.join(__dirname, '../../log/h5/'));
        tool.hasDir(fs, path.join(__dirname, '../../log/h5/visit/'));
        tool.hasDir(fs, path.join(__dirname, '../../log/h5/out/'));
        tool.hasDir(fs, path.join(__dirname, '../../log/h5/error/'));
        tool.hasDir(fs, path.join(__dirname, '../../log/www/'));
        tool.hasDir(fs, path.join(__dirname, '../../log/www/error/'));
        tool.hasDir(fs, path.join(__dirname, '../../log/www/out/'));
    }
});

module.exports = router;
