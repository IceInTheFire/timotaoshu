const redisData = require('./redisData.js');
const md5 = require('./md5.js');
const ipQueue = require("./ipQueue.js");
const catalogQueue = require("./catalogQueue.js");
const queue = require("./queue.js");
const permissionList = require("./permissionList.js");
let iconv = require("iconv-lite");

const toJson = function(data, msg, code) {
    return JSON.stringify({
        code: code || 1000,
        data: data,
        msg: msg || ''
    });

    /*
    * code
    * 1000   请求接口成功
    * 1002   代码错误，前端直接显示报错信息
    * 1003   token验证失败，前端直接跳转到登录页
    * 1004   权限不够，前端直接跳转到首页
    * */
}

function encodeURIComponent_GBK(str) {
    if(str==null || typeof(str)=='undefined' || str=='')
        return '';

    var a = str.toString().split('');

    for(var i=0; i<a.length; i++) {
        var ai = a[i];
        if( (ai>='0' && ai<='9') || (ai>='A' && ai<='Z') || (ai>='a' && ai<='z') || ai==='.' || ai==='-' || ai==='_') continue;
        var b = iconv.encode(ai, 'gbk');
        var e = ['']; // 注意先放个空字符串，最保证前面有一个%
        for(var j = 0; j<b.length; j++)
            e.push( b.toString('hex', j, j+1).toUpperCase() );
        a[i] = e.join('%');
    }
    return a.join('');
}

function url_encode(url){
    url = encodeURIComponent(url);
    url = url.replace(/\%3A/g, ":");
    url = url.replace(/\%2F/g, "/");
    url = url.replace(/\%3F/g, "?");
    url = url.replace(/\%3D/g, "=");
    url = url.replace(/\%26/g, "&");
    return url;
}

//查看是否有此文件夹，没有则建立一个文件夹
function hasDir(fs, path){
    let exists = fs.existsSync(path);
    if(!exists){
        fs.mkdirSync(path);
    }
}

//查看该文件是否重复，若重复，返回该文件名+ " - 副本"
//改版了。现在不用返回  " - 副本"
function isRepeat(fs, path){
    // let exists = fs.existsSync(path);
    // if(exists){
    //     if(fs.statSync(path).isDirectory()) {  //文件夹
    //         return isRepeat(fs, path + ' - 副本');
    //     } else {
    //         let split = path.split('.');
    //         let length = split.length;
    //         split[length - 2] = split[length - 2] + ' - 副本';
    //         let returnPath = split.join('.');
    //         return isRepeat(fs, returnPath);
    //     }
    // } else {
    //     return path;
    // }
    return path;
}
//删除整个文件夹，包括文件夹下的文件
//也可以大材小用只删除文件
function deleteAll(fs,path) {
    if(fs.existsSync(path) && !fs.statSync(path).isDirectory()) { // 先判断存在不存在  再判断文件类型，判断是不是文件夹 即 文件存在切不是文件夹
        fs.unlinkSync(path);    //删除文件
        console.log("成功删除了--" + path);
        return true;
    }
    var files = [];
    if(fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function(file, index) {
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // 判断文件类型，判断是不是文件夹
                deleteAll(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
                console.log("成功删除了--" + curPath);
            }
        });
        fs.rmdirSync(path);
    }
}
//
/*
* 批量删除文件和文件夹，
* basePath  前缀
* pathStr   文件和文件名，以逗号隔开
* isFile    只允许文件
* */
function deleteBatch(fs, basePath, pathStr, isFile) {
    let pathArr = pathStr.split(',');
    let fileCount = 0;
    let dirCount = 0;
    pathArr.forEach((file, index) => {
        let curPath = basePath + file;
        if(fs.existsSync(curPath)) {
            if(fs.statSync(curPath).isDirectory()) { // 判断文件类型，判断是不是文件夹
                if(!isFile) {
                    deleteAll(curPath);
                    dirCount++;
                }
            } else { // delete file
                fs.unlinkSync(curPath);
                fileCount++;
                console.log("成功删除了--" + curPath);
            }
        }
    });
    if(fileCount && dirCount) {
        return `删除了${fileCount}个文件，删除了${dirCount}个文件夹及文件夹内的内容`;
    } else if (fileCount) {
        return `删除了${fileCount}个文件`;
    } else if (dirCount) {
        return `删除了${dirCount}个文件夹及文件夹内的内容`;
    } else {
        return;
    }
}


function jiami(name){
    let i = 0, length = name.length;
    let arr = ["jiami"]
    for(i; i<length; i++) {
        arr.push(name[i].charCodeAt() + 20);
    }
    return arr.join("_");
}

function jiemi(str){
    if(str.indexOf("jiami_") != 0){
        return str;  //不是加密文
    }
    let arr = str.split("_");
    str = "";
    let i = 1, length = arr.length;
    for(i; i<length; i++) {
        str += String.fromCharCode(arr[i] - 20);
    }
    return str;
}

function getHost(url){
    let str = "";
    if(url.indexOf("http://") == 0) {
        url = url.split("http://")[1];
        str = "http://";
    } else if(url.indexOf("https://") == 0) {
        url = url.split("https://")[1];
        str = "https://"
    }
    return str + url.split("/")[0];
}
//处理 mysql-promise 里返回的数据
function getData(data) {
    let i = 0;
    let length = data.length;
    let arr = [];
    for(i;i<length; i++) {
        let mores = Object.keys(data[i]);
        if(mores.length > 1) {
            let obj = {};
            mores.forEach((value, index) =>{
                obj[value] = data[i][value];
            });
            arr.push(obj);
        } else {
            // arr.push(data[0][i][mores[0]]);
            arr = data[i][mores[0]];
        }
    }
    return arr;
}

function sleep(millisecond) {
    return new Promise((resolve, reject) => {
        let set = setTimeout(() => {
            clearTimeout(set);
            set = null;
            resolve(true);
        }, millisecond);
    });
}

//数组去重  去掉false "" undefined null
function distinct(arr){
    var i, j, len = arr.length;
    for(i = 0; i<len; i++) {
        if(!arr[i]) {
            arr.splice(i,1);
            len--;
            i--;
        }
    }
    for(i = 0; i < len; i++){
        for(j = i + 1; j < len; j++){
            if(arr[i] == arr[j]){
                arr.splice(j,1);
                len--;
                j--;
            }
        }
    }
    return arr;
};

function arrIsRepeat(arr) {
    var i, j, len = arr.length;
    for(i = 0; i < len; i++){
        for(j = i + 1; j < len; j++){
            if(arr[i] == arr[j]){
                return true;
            }
        }
    }
    return false;
}

//判断是不是数字
function strIsNumber(str) {
    var patrn = /^(-)?\d+(\.\d+)?$/;
    if (patrn.exec(str) == null || str == "") {
        return false
    } else {
        return true
    }
}

//判断是不是整数
function strIsInt(str) {
    var patrn = /^[0-9]*$/;
    if (patrn.exec(str) == null || str == "") {
        return false
    } else {
        return true
    }
}


/**判断是否是手机号**/
function isMobile(tel) {
    var reg = /^0?1[3|4|5|6|7|8][0-9]\d{8}$/;
    return reg.test(tel);
}


let token = redisData.token;


/*
* 正则放定义的原因：
* 是我不想在函数里重复定义正则，比较损性能，但如果不是多次使用级别的，那也损不了多少性。
* */
// var reg =  /<[^>]+>/gi;  //过滤所有的html标签
let reg =  new RegExp('<[^>]+>','gi');  //过滤所有的html标签，不包括内容

// var reg2 = /<(img|br|hr|input)[^>]*>/gi;  //只匹配img、br、hr、input标签
let reg2 = new RegExp('<(img|hr|input)[^>]*>','gi');  //分组匹配，过滤所有的html标签，包括内容

// var reg3 = /<(\S*)[^>]*>[^<]*<\/(\1)>/gi;        //分组匹配，过滤所有的html标签，包括内容
let reg3 = new RegExp('<(\\S*)[^>]*>[^<]*<\\/(\\1)>','gi');  //分组匹配，过滤所有的html标签，包括内容



/*
* 将所有的标签过滤，不过滤标签内内容
* */
function filterHtml(str){
    if(typeof str !='string'){  //不是字符串
        return str;
    }

    return str.replace(reg,'');
}

/*
* 讲所有的标签过滤，也过滤标签内的内容
* str 需要过滤的字符串
* isbool  为false则需要单标签过滤，为true则不需要单标签过滤
* */
function filterHtmlOrContainer(str,isbool) {
    if(typeof str !='string'){      //不是字符串
        return str;
    }
    let result = str;
    if(!isbool){        //先把单标签过滤了
        result = result.replace(reg2, '');
    }
    result = result.replace(reg3,'');       //先经过分组匹配，把双标签去除，如果是嵌套标签，则会先将嵌套标签内的双标签过滤掉
    if(reg3.test(result)) {                 //如果为true，则代表还有标签
        return filterHtmlOrContainer(result, true);
    }else {
        return result;
    }
}

/*
* 统一获取接口参数，
*
* 同时也为了防止sql注入   把英文双引号改成了英文单引号
*
* sql语法尽量用双引号
*
* notrans 默认false 如果不想转义的话，则设为true ，，一般
* */
function getParams(req, name, notrans){
    let body = (req.query[name] || req.body[name] || '');
    if(!notrans){
        return body.replace(/"/g,"'");
    }
    return body;
}

/*
* 存储到sql的时候，将双引号转义了
* 用三个转义的原因是:在字符串会生成转义的，但mysql里也需要被转义
* 例子：
* 传入:  `你好，"双双"`
* 经toSql转换，生成的字符串是，`你好，\"双双\"`
* mysql里需要的就是：`你好，\"双双\"`
*
* */
function toSql(param){
    param = param || '';
    return param.replace(/"/g,"\\\"");
}


/*
* 允许访问
*
* 为了跨域
* */
function allowVisit(res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
}

/*
* 存入mysql前，先处理章节内容并分段以数组形式输出
* 把章节内容的双引号全部转换为\"
*
*
* 参数  content   章节内容     size 分段的长度，默认255
* 返回  []
* */
function handleContent(content, size) {
    let length = content.length;
    // content = content.replace(/"/g,/\\"/);
    size = size || 255;
    let count = Math.ceil(length/size)
    let arr = [];
    let i = 0;
    for(i; i<count;i++){
        arr.push(content.slice(i * size, size *(i + 1)));
    }
    return arr;
}




module.exports = {
    toJson,
    token,
    redisData,
    md5,
    hasDir,
    isRepeat,
    deleteAll,
    deleteBatch,
    jiami,
    jiemi,
    getHost,
    getData,
    encodeURIComponent_GBK,
    url_encode,
    sleep,
    distinct,
    arrIsRepeat,
    strIsNumber,
    strIsInt,
    isMobile,
    filterHtml,
    filterHtmlOrContainer,
    permissionList:permissionList.permissionList,
    allPermissionList:permissionList.allPermissionList,
    ipQueue,
    catalogQueue,
    queue,
    allowVisit,
    getParams,
    toSql,
    handleContent
}