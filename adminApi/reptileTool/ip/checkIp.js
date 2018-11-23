const { oauth, tool, db, log, rp, cheerio, iconv,request,timoRp } = require("../../tool/require");


// let started = Date.now();
// const printTime = label => () => console.log('%d ms\t%s', Date.now() - started, label);
// async function checkIp(ipObj, target) {
//     return new Promise((resolve, reject) => {
//         rp({
//             uri: target || 'https://www.baidu.com/',
//             headers:{
//                 "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36"
//             },
//             timeout: 10000,  //10s没有返回则视为代理不行
//             proxy:`${ipObj.protocol}://${ipObj.ip}:${ipObj.port}`
//
//         }).then(function(data){
//
//             resolve([ipObj, true]);
//         }).catch(function(err){
//             resolve([ipObj, false, err]);
//         });
//     });
// };


// async function checkIp(ipObj, target) {  //第二个参数暂时无用
//     return new Promise((resolve, reject) => {
//         let options = {
//             url: target || 'https://www.baidu.com',         //会导致一个可怕的bug 至今无法解决
//             // url: target || 'https://www.baidu.com?v='+Math.ceil(Math.random() * 10000),         //会导致一个可怕的bug 至今无法解决
//             // url: target || 'http://ip.chinaz.com/getip.aspx',
//             // url: target || 'https://www.biquge.cc',          //会导致一个可怕的bug 至今无法解决
//             // url: target || 'https://www.biquge5200.cc/60_60944/',
//             headers:{
//                 "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36"
//             },
//             encoding : null,
//             // json:true,
//             // method: 'GET',
//             timeout: 10000,
//             proxy:`${ipObj.protocol}://${ipObj.ip}:${ipObj.port}`
//         };
//
//
//         // try {
//         //     rp(options).then(function(data){
//         //         resolve([ipObj, true]);
//         //     }).catch(function(err){
//         //         resolve([ipObj, false, err]);
//         //     });
//         // } catch(err) {
//         //     log.error(err);
//         //     log.info(err);
//         // }
//         let chaoshi = true;
//         var req = request(options, function (error, response, body) {
//             chaoshi = false;
//             if (!error && response.statusCode == 200) {
//                 // console.log(body);
//                 resolve([ipObj, true]); //检验成功
//             } else {
//                 resolve([ipObj, false, error]); //检验失败
//             }
//         }, printTime('callback')());
//         let timeout = setTimeout(function() {
//             if(chaoshi) {
//                 console.log(`代理：${options.proxy}，访问地址：${options.url}  访问超过十秒`)
//                 console.log("超过十秒摧毁");
//                 req.abort();
//                 resolve([ipObj, false, '访问超过十秒']); //检验失败
//             }
//             clearTimeout(timeout);
//             timeout = null;
//         }, 10000)
//     });
// };
//
//

async function checkIp(ipObj, target) {
    return new Promise((resolve, reject) => {
        timoRp({
            uri: target || 'https://www.baidu.com/',
            headers:{
                "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36"
            },
            timeout: 10000,  //10s没有返回则视为代理不行
            proxy:`${ipObj.protocol}://${ipObj.ip}:${ipObj.port}`

        }).then(function(data){
            resolve([ipObj, true]);
        }).catch(function(err){
            resolve([ipObj, false, err]);
        });
    });
};

module.exports = checkIp;