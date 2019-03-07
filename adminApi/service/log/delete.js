
const { tool, path, fs, log } = require("../../tool/require");

async function dele(logType, nameArr) {
    return new Promise((resolve,reject) => {
        let basePath = ""; //读取的地址
        switch(logType){
            case 1://  adminApi访问日志 www
                basePath = path.join(global.__base, "log/adminApi/visit/");
                break;
            case 2://  adminApi打印日志 www
                basePath = path.join(global.__base, "log/adminApi/out/");
                break;
            case 3://  adminApi报错日志 www
                basePath = path.join(global.__base, "log/adminApi/error/");
                break;
            case 4://  h5访问日志       h5
                basePath = path.join(global.__base, "log/h5/visit/");
                break;
            case 5://  h5打印日志       h5
                basePath = path.join(global.__base, "log/h5/out/");
                break;
            case 6://  h5报错日志       h5
                basePath = path.join(global.__base, "log/h5/error/");
                break;
            case 7://  www打印日志      server
                basePath = path.join(global.__base, "log/www/out/");
                break;
            case 8://  www报错日志      server
                basePath = path.join(global.__base, "log/www/error/");
                break;
            default:// adminApi访问日志  默认     www
                basePath = path.join(global.__base, "log/adminApi/visit/");
                break;
        }

        let result = tool.deleteBatch(fs, basePath, nameArr, true);
        if(result) {
            resolve(result.replace("文件","日志"));

        } else {
            reject("没有删除任何日志");
        }
    });
}


module.exports = dele;