let async;
if(global.timotaoApi) {
    async = global.timotaoApi.async;
} else {
    async = require("async");
}
// let count = 0;
// let response = 0;
let catalogQueue = async.queue(function (obj, cb) {
    // count++;

    // console.log(count);
    obj.pro.apply(this, obj.params).then((data) => {
        // obj.result && obj.result.apply(this, data);
        // response++;
        // console.log(response);
        if(typeof data == "string" && data.indexOf('连接10次都是失败') == 0) {
            obj.error && obj.error();
            cb();
        } else {
            obj.result && obj.result(data);   //data是字符串或者null
            cb();
        }
    }).catch((err) => {
        // response++;
        // console.log(response);
        obj.error && obj.error(err);
        console.log("报错");
        console.log(err);
        cb(err);
    });
}, 500);


catalogQueue.empty = function() {
    // console.log("当最后一个任务交给worker执行时，会调用empty函数");
    // console.log("开始执行到最后一个");
}
catalogQueue.saturated = function() {
    // console.log("即将用完");
    // console.log("worker数量将用完时，会调用saturated函数");
}
catalogQueue.drain = function() {
    console.log("所有任务执行完毕");
    // console.log("当所有任务都执行完时，会调用drain函数");
}


module.exports = catalogQueue;