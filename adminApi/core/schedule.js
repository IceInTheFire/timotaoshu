const schedule = require('node-schedule');
const { oauth, tool,log,wss} = require("../tool/require");
const {reptileService,ipReptileService,logService} = require('../service/')
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



// /*
// * 每天零点的一个定时任务
// * */
// var rule = new schedule.RecurrenceRule();
// rule.hour = 0;
// rule.minute = 0;
// var j = schedule.scheduleJob(rule, function(){
//     console.log('每晚0点---现在时间：', new Date());   //每晚零点报时间
// });
//
//
// /*
// * 每两分钟的一个定时任务
// * */
// var rule2 = new schedule.RecurrenceRule();
// rule2.minute = [];
// let i = 0, length = 30;
// for(i; i<length; i++){
//     rule2.minute.push(i*2);
// }
// var j2 = schedule.scheduleJob(rule2, function(){
//     console.log('每零分钟---现在时间：',new Date());
//     console.log("定时任务开始:"+new Date().getTime());
//     tool.catalogQueue.push({
//         params: [],
//         pro: scheduleJobTask1,
//         result: (data) => {
//             console.log("定时任务结束:"+new Date().getTime());
//         },
//         error: (err) => {
//             console.log("定时任务结束error:"+new Date().getTime());
//         }
//     });
// });

/*
* 规则1  每晚零点定时任务
* */
let rule = new schedule.RecurrenceRule();
rule.hour = 0;
/*
* 规则2 每天早上7点定时任务
* */
let rule2 = new schedule.RecurrenceRule();
rule2.hour = 7;
/*
* 规则3  每两分钟一次定时任务
* */
let rule3 = new schedule.RecurrenceRule();
rule3.minute = [];
let i3 = 0, length3 = 30;
for(i3; i3<length3; i3++){
    rule3.minute.push(i3*2);
}
/*
* 规则4  每天凌晨1点和中午13点定时任务
* */
let rule4 = new schedule.RecurrenceRule();
rule4.hour = [1,13];
rule4.minute = 0;   //必填
/*
* 规则5 凌晨3点的定时任务
* */
let rule5 = new schedule.RecurrenceRule();
rule5.hour = 3;
rule5.minute = 0;   //必填
/*
* 规则6 每两个小时一次的定时任务
* */
let rule6 = new schedule.RecurrenceRule();
// rule6.hour = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
// rule6.hour = [];
rule6.hour = [0,2,4,6,8,10,12,14,16,18,20,22];
rule6.minute = 0;   //必填
// let i6 = 0, length6 = 12;
// for(i6; i6<length6; i6++){
//     rule6.hour.push(i6*2);
// }




/*
* 规则4  每天凌晨1点和中午13点定时任务
* 爬取代理ip，然后去重，然后再检查
* */
let j4 = schedule.scheduleJob(rule4, function(){
    log.debug("定时任务4：" + new Date().Format());
    wss.broadcast("定时任务4：" + new Date().Format());
    ipReptileService.startReptile().then(() => {
        ipReptileService.removeRepeat().then(() => {
            ipReptileService.check().then(() => {
                log.debug("ip更新成功，ip更新时间为：" + new Date().Format());
            });
        });

    })
});

/*
* 规则4  每天凌晨3点
* 截取所有的服务器日志
* */
let j5 = schedule.scheduleJob(rule5, async function(){
    await logService.splice(1);
    // await logService.splice(2);
    // await logService.splice(3);
    await logService.splice(4);
    // await logService.splice(5);
    // await logService.splice(6);
    // await logService.splice(7);
    // await logService.splice(8);
}) ;
/*
* 规则6 每两个小时一次的定时任务
* 1、未爬取的开始爬书
* 2、开始爬取错误章节列表里的
* 间隔5分钟
* 3、检查代理ip是否可用，不可用删除
* 4、再一次爬取错误章节列表里的
*
* */
let j6 = schedule.scheduleJob(rule6, function(){
    log.debug("定时任务6：" + new Date().Format());
    wss.broadcast("定时任务6：" + new Date().Format());
    reptileService.startReptile().then(() => {
        log.debug("定时任务6：章节开始爬取，爬取完毕时间为：" + new Date().Format());
        errorCatalogAgain();
    }).catch(() => {
        errorCatalogAgain();
    });

    /*
    * 再一次爬取错误章节  也就是爬取两次
    * */
    function errorCatalogAgain(){
        errorCatalogReptile(async () => {
            // let set = setTimeout(() => {
            //     ipReptileService.check().then(() => {
            //         errorCatalogReptile();
            //     });
            //     clearTimeout(set);
            //     set = null;
            // }, 1000 * 300); //5分钟  因为错误章节5分钟一次
            await tool.sleep(1000*300);
            ipReptileService.check().then(() => {
                errorCatalogReptile();
            });

        });
    }

    /*
    * 爬取错误章节
    * */
    function errorCatalogReptile(callback){
        reptileService.oneKeyRestartCatalog().then(() => {
            log.debug("定时任务：错误章节开始爬取，爬取完毕时间为：" + new Date().Format());
            callback && callback();
        });
    }
});



module.exports = {
    // j,
    // j2
};