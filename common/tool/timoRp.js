const request = global.timotaoApi? global.timotaoApi.request : require("request");

const timoRp = function(options) {
    // let started = Date.now();
    // const printTime = label => () => console.log('%d ms\t%s', Date.now() - started, label);
    return new Promise((resolve, reject) => {
        let chaoshi = true;
        let reqOptions = Object.assign({}, options);
        reqOptions.transform = null;
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
                reject(error);
            }
        }, time(options.timeout));
        /*
        * 设置超时
        * */
        function time(timeout) {
            if(parseInt(timeout) > 0) {
                let setTime = setTimeout(() => {
                    if(chaoshi) {
                        req.abort();
                        reject(`访问超时${timeout}ms`);
                    }
                    clearTimeout(setTime);
                    setTime = null;
                }, timeout)
            }
        }

    });
}









module.exports = timoRp;