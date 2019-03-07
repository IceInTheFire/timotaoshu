let async = require("async");

let queue = async.queue(function (obj, cb) {
    obj.pro.apply(this, obj.params).then(async (data) => {
        obj.result && await obj.result.apply(this, data);
        await cb();
    }).catch(async (err) => {
        console.log("queue报错啦");
        console.log(err);
        obj.error && await obj.error(err);
        await cb(err);
    });
}, 150);

queue.empty = function() {
    // console.log("当最后一个任务交给worker执行时，会调用empty函数");
    // console.log("开始最后一个ip检查");
}
queue.saturated = function() {
    // console.log("worker数量将用完时，会调用saturated函数");

}
queue.drain = function() {
    // console.log("哭泣")
    // console.log("当所有任务都执行完时，会调用drain函数");
}


module.exports = queue;