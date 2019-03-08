const {fs, path,log} = require('../tool/require');

const basePathG = path.join(__dirname, '../routes');
let arrG = fs.readdirSync(basePathG);
let basePathStrG = "";


function routeEach(app, pathArr, basePathStr, basePath) {
    pathArr = pathArr ? pathArr : arrG;
    basePathStr = basePathStr ? basePathStr : basePathStrG;
    basePath = basePath ? basePath : basePathG;

    let i, length = pathArr.length;
    for(i = 0; i<length; i++){
        let pathStr = path.join(basePath,`${basePathStr}/${pathArr[i]}`);
        if(!isExists(pathStr)) {   //检查是否有该文件或者目录  没有就继续下一个循环
            continue;
        }
        if(isDir(pathStr)) {        //检查是不是文件夹
            let arr = fs.readdirSync(pathStr);
            routeEach(app, arr, `${basePathStr}/${pathArr[i]}`, basePath);
        }else {
            let str = "";
            if(pathArr[i] == 'index.js') {
                str = `${basePathStr}`;
            } else {
                str = `${basePathStr}/${pathArr[i].substring(0, pathArr[i].length - 3)}`;
            }
            // if(basePathStr == "/images") {
            //     app.use(str, require(pathStr));
            // } else {
            //     app.all(str, require(pathStr));   //切记不要用app.use
            // }
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