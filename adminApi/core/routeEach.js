const {fs, path} = require('../tool/require');

function routeEach(pathArr, basePathStr, basePath, app) {
    let i, length = pathArr.length;
    for(i = 0; i<length; i++){
        let pathStr = path.join(basePath,`${basePathStr}/${pathArr[i]}`);
        if(!isExists(pathStr)) {   //检查是否有该文件或者目录  没有就继续下一个循环
            continue;
        }
        if(isDir(pathStr)) {        //检查是不是文件夹
            let arr = fs.readdirSync(pathStr);
            routeEach(arr, `${basePathStr}/${pathArr[i]}`, basePath, app);
        }else {
            let str = "";
            if(pathArr[i] == 'index.js') {
                str = `${basePathStr}`;
            } else {
                str = `${basePathStr}/${pathArr[i].substring(0, pathArr[i].length - 3)}`;
            }
            if(basePathStr == "/images") {
                app.use(str, require(pathStr));
            } else {
                app.all(str, require(pathStr));   //切记不要用app.use
            }

        }
    }
}

function isExists(path){
    if(fs.existsSync(path)) {
        return true;
    }
    return;
}

function isDir(path) {
    if(fs.existsSync(path) && fs.statSync(path).isDirectory()) {  //先判断存在不存在  再判断文件类型，判断是不是文件夹
        return true;
    }
    return false;
}

module.exports = routeEach;