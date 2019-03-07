const { tool, path, fs, log } = require("../../tool/require");

async function splice(logType) {
    return new Promise((resolve, reject) => {
        let filePath = "";      //截取的原地址
        let basePath = "";      //写入的地址
        switch(logType){
            case 1://  adminApi访问日志   www
                filePath = path.join(global.__base, "urlLog.log");
                basePath = path.join(global.__base, "log/adminApi/visit/adminApiUrlLog-" + new Date().Format("yyyy-MM-dd hh时mm分ss秒S") + ".log");
                break;
            case 2://  adminApi打印日志   www
                // basePath = path.join(global.__base, "log/adminApi/out");
                filePath = path.join(global.__base, "../../.pm2/logs/www-out.log");
                basePath = path.join(global.__base, "log/adminApi/out/adminApiOutLog-" + new Date().Format("yyyy-MM-dd hh时mm分ss秒S") + ".log");
                break;
            case 3://  adminApi报错日志   www
                filePath = path.join(global.__base, "../../.pm2/logs/www-error.log");
                // basePath = path.join(global.__base, "log/adminApi/error");
                basePath = path.join(global.__base, "log/adminApi/error/adminApiErrorLog-" + new Date().Format("yyyy-MM-dd hh时mm分ss秒S") + ".log");
                break;
            case 4://  h5访问日志  h5
                filePath = path.join(global.__base, "../h5/urlLog.log");
                basePath = path.join(global.__base, "log/h5/visit/h5UrlLog-" + new Date().Format("yyyy-MM-dd hh时mm分ss秒S") + ".log");
                break;
            case 5://  h5打印日志  h5
                filePath = path.join(global.__base, "../../.pm2/logs/h5-out.log");
                // basePath = path.join(global.__base, "log/h5/out");
                basePath = path.join(global.__base, "log/h5/out/h5OutLog-" + new Date().Format("yyyy-MM-dd hh时mm分ss秒S") + ".log");
                break;
            case 6://  h5报错日志  h5
                filePath = path.join(global.__base, "../../.pm2/logs/h5-error.log");
                // basePath = path.join(global.__base, "log/h5/error");
                basePath = path.join(global.__base, "log/h5/error/h5ErrorLog-" + new Date().Format("yyyy-MM-dd hh时mm分ss秒S") + ".log");
                break;
            case 7://  www打印日志  server
                filePath = path.join(global.__base, "../../.pm2/logs/server-out.log");
                // basePath = path.join(global.__base, "log/www/out");
                basePath = path.join(global.__base, "log/www/out/wwwOutLog-" + new Date().Format("yyyy-MM-dd hh时mm分ss秒S") + ".log");
                break;
            case 8://  www报错日志   server
                filePath = path.join(global.__base, "../../.pm2/logs/server-error.log");
                // basePath = path.join(global.__base, "log/www/error");
                basePath = path.join(global.__base, "log/www/error/wwwErrorLog-" + new Date().Format("yyyy-MM-dd hh时mm分ss秒S") + ".log");
                break;
            default:// adminApi访问日志  默认     www
                filePath = path.join(global.__base, "urlLog.log");
                // basePath = path.join(global.__base, "log/adminApi/visit");
                basePath = path.join(global.__base, "log/adminApi/visit/adminApiUrlLog-" + new Date().Format("yyyy-MM-dd hh时mm分ss秒S") + ".log");
                break;
        }

        /*
        * 先copy   先read 再写入
        * 再清空
        * */
        try{
            let container = fs.readFileSync(filePath);
            fs.writeFileSync(basePath ,container);
            fs.writeFileSync(filePath,"");
            resolve("截取成功");
        }catch(err) {
            log.error("失败原因：" + err);
            reject("截取失败")
        }
    })
}


module.exports = splice;