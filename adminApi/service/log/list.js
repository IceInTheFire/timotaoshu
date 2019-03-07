const {tool, db, log, fs, path} = require("../../tool/require");

async function list(logType,page,limit) {
    return new Promise((resolve,reject) => {
        hasDir(); //判断有没有。有的话，就不理会，没有的话，新建文件夹
        let basePath = ""; //读取的地址
        switch(logType){
            case 1://  adminApi访问日志     www
                basePath = path.join(global.__base, "log/adminApi/visit/");
                break;
            case 2://  adminApi打印日志     www
                basePath = path.join(global.__base, "log/adminApi/out/");
                break;
            case 3://  adminApi报错日志     www
                basePath = path.join(global.__base, "log/adminApi/error/");
                break;
            case 4://  h5访问日志   h5
                basePath = path.join(global.__base, "log/h5/visit/");
                break;
            case 5://  h5打印日志   h5
                basePath = path.join(global.__base, "log/h5/out/");
                break;
            case 6://  h5报错日志   h5
                basePath = path.join(global.__base, "log/h5/error/");
                break;
            case 7://  www打印日志   server
                basePath = path.join(global.__base, "log/www/out/");
                break;
            case 8://  www报错日志   server
                basePath = path.join(global.__base, "log/www/error/");
                break;
            default:// adminApi访问日志  默认     www
                basePath = path.join(global.__base, "log/adminApi/visit/");
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

        resolve(logList);


        function hasDir(){
            tool.hasDir(fs, path.join(global.__base, "log/"));
            tool.hasDir(fs, path.join(global.__base, "log/adminApi/"));
            tool.hasDir(fs, path.join(global.__base, "log/adminApi/visit/"));
            tool.hasDir(fs, path.join(global.__base, "log/adminApi/out/"));
            tool.hasDir(fs, path.join(global.__base, "log/adminApi/error/"));
            tool.hasDir(fs, path.join(global.__base, "log/h5/"));
            tool.hasDir(fs, path.join(global.__base, "log/h5/visit/"));
            tool.hasDir(fs, path.join(global.__base, "log/h5/out/"));
            tool.hasDir(fs, path.join(global.__base, "log/h5/error/"));
            tool.hasDir(fs, path.join(global.__base, "log/www/"));
            tool.hasDir(fs, path.join(global.__base, "log/www/error/"));
            tool.hasDir(fs, path.join(global.__base, "log/www/out/"));
        }
    });
}


module.exports = list;