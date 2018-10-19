const express = require('express'),
    app = express();
var compress = require('compression');  //gzip压缩
app.use(compress());
const routeEach = require('./core/routeEach');
// require('./core/datePrototype');
require('../common/prototype');
const morgan = require('./core/morganLog');
const scheduleObj = require('./core/schedule');     //定时任务
const upload = require('./core/upload-mutter');     //文件上传
const {fs, path, tool, log} = require('./tool/require');
const hostArr = require('../common/host');      //允许访问的域名
// const bodyParser = require('body-parser');
global.server = false;       //如果是服务器，改为true    前提是服务器有配置privoxy代理，如果没有配置，建议还是false
global.serverProxy = 'http://127.0.0.1:8118';  //服务器的代理配置
global.reptileCatalog = 0;//爬虫正在爬的数量

app.all('*', function (req, res, next) {
    if (hostArr.indexOf(req.headers.host) == -1) {
        log.error(`${req.headers.host}在${new Date().Format()}访问，已被拦截`);
        res.send("总有刁民想害朕，锦衣卫护驾");
    } else {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By", ' 3.2.1')
        res.header("Content-Type", "application/json;charset=utf-8");
        next();
    }
});

upload(tool, path, fs, app);     //上传方法

app.use(express.static(path.join(__dirname, 'public')));    //静态资源
morgan(app);

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const basePath = path.join(__dirname, './routes');
let arr = fs.readdirSync(basePath);
let basePathStr = "";

routeEach(arr, basePathStr, basePath, app);
app.use(function (req, res, next) {
    res.send("没有接口");
});

module.exports = app;

//捕获node异常  不允许退出
process.on('uncaughtException', function (err) {
    console.log("api异常退出被捕获了");
    console.error(err.stack);
    console.log("Node NOT Exiting...");
});
