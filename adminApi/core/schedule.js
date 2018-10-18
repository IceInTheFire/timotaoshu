const schedule = require('node-schedule');
const { oauth, tool} = require("../tool/require");
/*
* 指定时间执行方法
*
* 在2018年9月26日16点0分0秒，打印
*
* 月份是要减一的，程序里的1月份是0
* */
// var date = new Date(2018, 8, 26, 19, 2, 0);
// var j = schedule.scheduleJob(date, function(){
//     console.log(`我在${new Date()}的时候，执行了定时任务`);
// });
/*
* 取消任务
* */
// j.cancel();


/*
* 指定时间间隔执行方法
*
* 这是每当秒数为10时打印时间。
*
* 如果想每隔10秒执行，设置 rule.second =[0,10,20,30,40,50]即可。
*
* 同理:
*    每秒执行就是rule.second =[0,1,2,3......59]
*    每分钟0秒执行就是rule.second =0
*    每小时30分执行就是rule.minute =30;rule.second =0;
*    每天0点执行就是rule.hour =0;rule.minute =0;rule.second =0;
*    ....
*    每月1号的10点就是rule.date =1;rule.hour =10;rule.minute =0;rule.second =0;
*    每周1，3，5的0点和12点就是rule.dayOfWeek =[1,3,5];rule.hour =[0,12];rule.minute =0;rule.second =0;
* */

/*
* 这是每当秒数为10时打印时间。
*
* 每分钟的10秒钟执行
* */
// var rule = new schedule.RecurrenceRule();
// rule.second = 10;
// var j2 = schedule.scheduleJob(rule, function(){
//     console.log('每分钟执行---现在时间：',new Date());
// });
/*
* 取消任务
* */
// j2.cancel();



/*
* 这是每秒打印
*
* 每秒钟执行
* */
// var rule = new schedule.RecurrenceRule();
// rule.second = [];
// let i = 0, length = 60;
// for(i; i<length; i++){
//     rule.second.push(i);
// }
// var j3 = schedule.scheduleJob(rule, function(){
//     console.log('每秒钟执行---现在时间：',new Date());
// });
/*
* 取消任务
* */
// j3.cancel();

/*
* 这是每秒打印
*
* 每天0点执行
* */
// var rule = new schedule.RecurrenceRule();
// rule.hour = 0;
// rule.minute = 0;
// var j4 = schedule.scheduleJob(rule, function(){
//     console.log('每晚0点---现在时间：', new Date());   //每晚零点报时间
// });
/*
* 取消任务
* */
// j4.cancel();



/*
* 取消任务
* */
// j.cancel();
// j2.cancel();




var rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;
var j = schedule.scheduleJob(rule, function(){
    console.log('每晚0点---现在时间：', new Date());   //每晚零点报时间
});


/*
* 每两分钟的一个定时任务
* */
var rule2 = new schedule.RecurrenceRule();
rule2.minute = [];
let i = 0, length = 30;
for(i; i<length; i++){
    rule2.minute.push(i*2);
}
var j2 = schedule.scheduleJob(rule2, function(){
    console.log('每零分钟---现在时间：',new Date());
    console.log("定时任务开始:"+new Date().getTime());
    tool.catalogQueue.push({
        params: [],
        pro: scheduleJobTask1,
        result: (data) => {
            console.log("定时任务结束:"+new Date().getTime());
        },
        error: (err) => {
            console.log("定时任务结束error:"+new Date().getTime());
        }
    });
});

/*
* 定时任务1
* */
function scheduleJobTask1(params1, params2){
    return new Promise(async (resolve, reject) => {
        let set = new setTimeout(() => {
            resolve();
            clearTimeout(set);
            set = null;
        }, 5000);
    });
}


module.exports = {
    // j,
    // j2
};