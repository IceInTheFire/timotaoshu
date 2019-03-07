const { tool, path, fs, log } = require("../../tool/require");

async function download(logType,name) {
    return new Promise((resolve,reject) => {
        let basePath = ""; //读取的地址
        switch(logType){
            case 1://  adminApi访问日志
                basePath = path.join(global.__base, "log/adminApi/visit/" + name);
                break;
            case 2://  adminApi打印日志
                basePath = path.join(global.__base, "log/adminApi/out/" + name);
                break;
            case 3://  adminApi报错日志
                basePath = path.join(global.__base, "log/adminApi/error/" + name);
                break;
            case 4://  h5访问日志
                basePath = path.join(global.__base, "log/h5/visit/" + name);
                break;
            case 5://  h5打印日志
                basePath = path.join(global.__base, "log/h5/out/" + name);
                break;
            case 6://  h5报错日志
                basePath = path.join(global.__base, "log/h5/error/" + name);
                break;
            case 7://  www打印日志
                basePath = path.join(global.__base, "log/www/out/" + name);
                break;
            case 8://  www报错日志
                basePath = path.join(global.__base, "log/www/error/" + name);
                break;
            default:// adminApi访问日志  默认
                basePath = path.join(global.__base, "log/adminApi/visit/" + name);
                break;
        }
        resolve(basePath);
    });
}


module.exports = download;