const { tool, db, log,path,fs } = require("../tool/require");



module.exports = function(req, res, next) {
    req._startTime = new Date();    //获取请求时间

    var calResponseTime = function () {
        var now = new Date();   //获取响应时间
        let responseTime = now - req._startTime;


        let time = new Date().Format('yyyy/MM/dd hh:mm:ss S');
        let status = res.statusCode;
        let method = req.method;
        let url = req.url;

        let ip = req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
            req.connection.remoteAddress || // 判断 connection 的远程 IP
            req.socket.remoteAddress || // 判断后端的 socket 的 IP
            req.connection.socket.remoteAddress;
        // console.log(`${time} --- ${status} --- ${method} --- ${url} --- ${responseTime} --- ${ip}`)

        /*
        * \r 回车 \n 换行
        * */
        fs.appendFileSync(path.join(__dirname, '../urlLog.log'),
            `${time}  ---  ${status}  ---  ${method}  ---  ${url}  ---  ${responseTime}  ---  ${ip}\n`);
    }
    res.once('finish', calResponseTime);
    // res.once('close', calResponseTime);


    return next();
}