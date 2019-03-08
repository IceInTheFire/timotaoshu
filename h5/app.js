global.__base = __dirname + '/';        //设置全局require目录前缀
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const lessMiddleware = require('less-middleware');
const {log, path, fs} = require("./tool/require");
const routeEach = require('./core/routeEach');
// const morgan = require('./core/morganLog');
const urlLog = require('./core/urlLog');
require('ejs');
require('../common/prototype');
const hostArr = require('../common/host');

const app = express();
var compress = require('compression');  //gzip压缩
app.use(compress());


app.all('*', function(req, res, next) {
    if(hostArr.indexOf(req.headers.host) == -1) {
        log.error(`${req.headers.host}在${new Date().Format()}访问，已被拦截`);
        res.send("总有刁民想害朕，锦衣卫护驾");
    }  else {
        // console.log();
        next();
    }
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    // res.header("X-Powered-By",' 3.2.1')
    // res.header("Content-Type", "application/json;charset=utf-8");
    // next();
});


// const logger = require('morgan');
// app.use(logger('dev'));
// morgan(app);
// view engine setup
// app.set('views', path.join(__dirname, 'views'));   //开发
app.set('views', path.join(__dirname, 'dist-views'));  //线上
app.set('view engine', 'pug');
// app.set('view engine','ejs');


app.use(express.json());
app.use(express.urlencoded({extended: false}));       //自动解析参数
app.use(cookieParser());        //req.cookie

// app.use('/dist', express.static('../public/dist'));


/*
* 开发的时候使用
* 线上的话，则是需要写一个gulp来预编译less
* 鸡肋鸡肋，食之无味，弃之可惜的功能
* */
// app.use(lessMiddleware(path.join(__dirname + '/content'), {
//     // src: path.join(__dirname, '/Content/less'),
//     dest: path.join(__dirname, '/public'),
//     // prefix: path.join(__dirname + '/public/css'),
//     // prefix:'/',
//     // force: true,    //让每次请求的时候重新编译 LESS 文件，
//     debug: true,
//     // once: true
// }));
app.use(express.static(path.join(__dirname, 'dist')));
// app.use('/css', express.static(path.join(__dirname, 'public/css')));
// app.use('/js', express.static(path.join(__dirname, 'public/js')));


app.use(urlLog);    //生成访问日志
// app.all('*', function(req, res, next) {
//     req._startTime = new Date();    //获取请求时间
//
//     var calResponseTime = function () {
//         var now = new Date();   //获取响应时间
//         var deltaTime = now - req._startTime;
//         let responseTime = now - req._startTime;
//
//
//         let time = new Date().Format('yyyy/MM/dd hh:mm:ss.S');
//         let status = req.status;
//         let method = req.method;
//         let url = req.url;
//
//         let ip = req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
//             req.connection.remoteAddress || // 判断 connection 的远程 IP
//             req.socket.remoteAddress || // 判断后端的 socket 的 IP
//             req.connection.socket.remoteAddress;
//         console.log(deltaTime);
//         console.log(`${time} --- ${status} --- ${method} --- ${url} ---${responseTime}--- ${ip}`)
//     }
//     res.once('finish', calResponseTime);
//     res.once('close', calResponseTime);
//
//
//     next();
// })


routeEach(app);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    if(req.h5Error) {
        res.render('error', {h5Error:req.h5Error});
    }else{
        next(createError(404));
    }
});

// createError error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);

    res.render('error');
});

module.exports = app;


//捕获node异常  不允许退出
process.on('uncaughtException', function (err) {
    console.log("h5异常退出被捕获了");
    console.error(err.stack);
    console.log("Node NOT Exiting...");
});
