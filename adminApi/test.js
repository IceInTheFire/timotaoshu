// const { oauth, tool, db, log, rp, cheerio, iconv,request } = require("./tool/require");

const request = require("request");
let started = new Date().getTime();
const printTime = label => () => console.log('%d ms\t%s', new Date().getTime() - started, label);
let options = {
    url: 'https://www.baidu.com',         //会导致一个可怕的bug 至今无法解决
    headers:{
        "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36"
    },
    encoding : null,
    // json:true,
    // method: 'GET',
    timeout: 10000,
    proxy:`http://221.229.18.20:1133`
};

var req = request(options, function (error, response, body) {
    chaoshi = false;
    if (!error && response.statusCode == 200) {
        // // console.log(body);
        // resolve([ipObj, true]); //检验成功
        console.log("测试")
    } else {
        // resolve([ipObj, false, error]); //检验失败
        console.log("error");
    }
}, function(){
    console.log("我只是看看：")
}());
setTimeout(function() {
    console.log("超时");
    printTime("超时")()
    req.abort();
}, 10000);