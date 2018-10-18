var express = require('express');
var router = express.Router();
const { oauth, tool, path, fs, log } = require("../../tool/require");

router.use('', oauth(3004),  async function(req, res, next) {

    let logType = parseInt(tool.getParams(req, 'logType'));

    let filePath = '';      //截取的原地址
    let basePath = '';      //写入的地址
    switch(logType){
        case 1://  adminApi访问日志   www
            filePath = path.join(__dirname, '../../urlLog.log');
            basePath = path.join(__dirname, '../../log/adminApi/visit/adminApiUrlLog-' + new Date().Format('yyyy-MM-dd hh时mm分ss秒S') + '.log');
            break;
        case 2://  adminApi打印日志   www
            // basePath = path.join(__dirname, '../../log/adminApi/out');
            filePath = path.join(__dirname, '../../../../.pm2/logs/www-out.log');
            basePath = path.join(__dirname, '../../log/adminApi/out/adminApiOutLog-' + new Date().Format('yyyy-MM-dd hh时mm分ss秒S') + '.log');
            break;
        case 3://  adminApi报错日志   www
            filePath = path.join(__dirname, '../../../../.pm2/logs/www-error.log');
            // basePath = path.join(__dirname, '../../log/adminApi/error');
            basePath = path.join(__dirname, '../../log/adminApi/error/adminApiErrorLog-' + new Date().Format('yyyy-MM-dd hh时mm分ss秒S') + '.log');
            break;
        case 4://  h5访问日志  h5
            filePath = path.join(__dirname, '../../../h5/urlLog.log');
            basePath = path.join(__dirname, '../../log/h5/visit/h5UrlLog-' + new Date().Format('yyyy-MM-dd hh时mm分ss秒S') + '.log');
            break;
        case 5://  h5打印日志  h5
            filePath = path.join(__dirname, '../../../../.pm2/logs/h5-out.log');
            // basePath = path.join(__dirname, '../../log/h5/out');
            basePath = path.join(__dirname, '../../log/h5/out/h5OutLog-' + new Date().Format('yyyy-MM-dd hh时mm分ss秒S') + '.log');
            break;
        case 6://  h5报错日志  h5
            filePath = path.join(__dirname, '../../../../.pm2/logs/h5-error.log');
            // basePath = path.join(__dirname, '../../log/h5/error');
            basePath = path.join(__dirname, '../../log/h5/error/h5ErrorLog-' + new Date().Format('yyyy-MM-dd hh时mm分ss秒S') + '.log');
            break;
        case 7://  www打印日志  server
            filePath = path.join(__dirname, '../../../../.pm2/logs/server-out.log');
            // basePath = path.join(__dirname, '../../log/www/out');
            basePath = path.join(__dirname, '../../log/www/out/wwwOutLog-' + new Date().Format('yyyy-MM-dd hh时mm分ss秒S') + '.log');
            break;
        case 8://  www报错日志   server
            filePath = path.join(__dirname, '../../../../.pm2/logs/server-error.log');
            // basePath = path.join(__dirname, '../../log/www/error');
            basePath = path.join(__dirname, '../../log/www/error/wwwErrorLog-' + new Date().Format('yyyy-MM-dd hh时mm分ss秒S') + '.log');
            break;
        default:// adminApi访问日志  默认     www
            filePath = path.join(__dirname, '../../urlLog.log');
            // basePath = path.join(__dirname, '../../log/adminApi/visit');
            basePath = path.join(__dirname, '../../log/adminApi/visit/adminApiUrlLog-' + new Date().Format('yyyy-MM-dd hh时mm分ss秒S') + '.log');
            break;
    }

    /*
    * 先copy   先read 再写入
    * 再清空
    * */
    try{
        let container = fs.readFileSync(filePath);
        fs.writeFileSync(basePath ,container);
        fs.writeFileSync(filePath,'');
        res.send(tool.toJson('截取成功', '', 1000));
    }catch(err) {
        log.error("失败原因：" + err);
        res.send(tool.toJson(null, '截取失败', 1002));
    }
});

module.exports = router;
