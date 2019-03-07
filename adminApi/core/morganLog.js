const {fs, morgan, path} = require('../tool/require');


module.exports = function(app) {
    app.use(function(req, res, next) {
        req.time = new Date().Format('yyyy/MM/dd hh:mm:ss S');
        next()
    });
    morgan.token('time', function (req) {
        return req.time;
    });
    morgan.token('ip', function (req) {
        return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
            req.connection.remoteAddress || // 判断 connection 的远程 IP
            req.socket.remoteAddress || // 判断后端的 socket 的 IP
            (req.connection.socket ? req.connection.socket.remoteAddress :'');
        // return req.ip;
    })
    //自定义组件
    morgan.format('timotao', ':time  ---  :status :method :url  ---  :response-time  ---  :ip');  // response-time 请求到响应所需时间    :time请求的时间
    var accessLogStream = fs.createWriteStream(path.join(__dirname, '../urlLog.log'), {flags: 'a'});
    app.use(morgan('timotao', {stream: accessLogStream}));
}
