const request = require("request");
const userAgents = require('./user-agent.js');
const Agent = require("http").Agent;
const agent = new Agent({
    keepAlive: true,
    keepAliveMsecs:60000,
    maxSockets:5,
    maxFreeSockets:5,
});
const redisData = require('./redisData');

const timoRp = function(options) {
    return new Promise(async (resolve, reject) => {
        let chaoshi = true;
        let initOptions = {
            rejectUnauthorized: false,
            strictSSL:false,
            // followRedirect : true,
            headers: {
            //     //模拟谷歌浏览器
            //     // "User-Agent": userAgents[Math.floor(Math.random()*userAgents.length)], // 随机
            //     "User-Agent": 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36', // 谷歌浏览器
            },
            // agent,   // 不支持https
            timeout:20000,      // 默认20秒超时
        };
        let reqOptions = Object.assign(initOptions, options);

        /*
        * 代理ip start
        * */
        if(!options.noProxy && !options.proxy) {
            if(global.server) {
                initOptions.proxy = global.serverProxy
            }  else {
                let ip = await redisData.ipList.getRandomIpList();
                if(ip) initOptions.proxy = ip;
            }
        }
        options.proxy = initOptions.proxy;  // 借用js的对象特性，把proxy传递出去
        /*
        * 代理ip end
        * */

        /*
        * user-agent start
        * */
        if( options.userAgent == 'mobile') {        // mobile 的user-agent
            reqOptions.headers['User-Agent'] = userAgents.m[Math.floor(Math.random()*userAgents.m.length)];
        } else { // pc 的user-agent
            reqOptions.headers['User-Agent'] = userAgents.pc[Math.floor(Math.random()*userAgents.pc.length)];
        }
        /*
        * user-agent end
        * */

        delete reqOptions.userAgent;        // 请求之前，删除多余的东西
        delete reqOptions.transform;        // 请求之前，删除多余的东西
        var req = request(reqOptions, function (error, response, body) {
            chaoshi = false;
            if (!error && response.statusCode == 200) {
                if(options.transform) {     //options里的转换
                    resolve(options.transform(body, response));
                } else {
                    // resolve({body,response});
                    resolve(body);
                }
            } else {
                if(!error) {
                    reject("状态:" + response.statusCode)
                } else {
                    reject(error);
                }
            }
        }, time(options.timeout,options.nochaoshi));
        /*
        * 设置超时
        * */
        function time(timeout, nochaoshi) {
            if(nochaoshi) return;       // 设置了这个，则timeout无效
            if(parseInt(timeout) > 0) {
                let setTime = setTimeout(() => {
                    if(chaoshi) {
                        reject(`访问超时${timeout}ms`);
                        req.abort(`访问超时${timeout}ms`);
                    }
                    clearTimeout(setTime);
                    setTime = null;
                }, timeout)
            }
        }

    });
}









module.exports = timoRp;