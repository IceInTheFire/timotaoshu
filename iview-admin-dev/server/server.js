"use strict";

const express = require("express");
const path = require('path');
const history = require("connect-history-api-fallback");
const app = express();
const fs = require('fs');
const contentType = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
};
app.use(history())
const compress = require('compression');
app.use(compress());           //配合nginx做gzip压缩  express4以上写法

const hostArr = require('../../common/host');      //允许访问的域名
require('../../common/prototype');      //允许访问的域名
app.all('*', function(req, res, next) {
    if(hostArr.indexOf(req.headers.host) == -1) {
        console.error(`${req.headers.host}在${new Date().Format()}访问，已被拦截`);
        res.send("总有刁民想害朕，锦衣卫护驾");
    }  else {
        next();
    }
});


const crypto = require('crypto');  //加密
function sha1(str) {
    let md5sum = crypto.createHash('sha1');   //md5有一定的碰撞问题
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
}



// app.use(express.static("dist"))
// app.use('/dist', express.static('../dist/dist',{maxage: '2h'}));        //缓存两个小时
app.use('/dist', express.static('../dist/dist'));        //一直缓存
// app.use('/lib', express.static('../dist/lib',{maxage: '2h'}));          //缓存两个小时
app.use('/lib', express.static('../dist/lib'));          //一直缓存

app.get('*',function(req, res) {
    const url = req.originalUrl.split('?')[0];
    var html;
    if(!url || url == '/' || url == '/dist' || url == '/dist/' || url.indexOf('/dist') == -1){
        html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8');
    } else {
        return;
    }
    // res.header("ETag", sha1("html"));    //express有缓存的机制,所以这里不需要再次设置etag缓存了
    res.send(html);
});

app.listen(9092, () => {
    console.log("正在监听9092");
})


// locaohost:8888
