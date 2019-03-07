let async = require("async");

let catalogQueue = async.queue((obj, cb) => {
    obj.pro.apply(this, obj.params).then(async (data) => {
        if(typeof data == "string" && data.indexOf('错误：') == 0) {
            obj.error && await obj.error(data);
            await cb();
        } else {

            obj.result && await obj.result(data);   //data是字符串或者null
            await cb();
        }
    }).catch(async (err) => {
        console.log("catalogQueue报错");
        console.log(err);
        obj.error && await obj.error("错误：" + err);
        await cb(err);
    });
}, 150);

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
    // global.isReptile = false;       //这里是紧急修复bug，。问题是获取小说的json时，没有章节，然后导致爬书的时候，数量不对。到时候需要优化
    // console.log("当所有任务都执行完时，会调用drain函数");
}


module.exports = catalogQueue;