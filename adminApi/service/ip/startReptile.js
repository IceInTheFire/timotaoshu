let startIpReptile = require("../../reptileTool/ip/startIpReptile");

async function startReptile(startPage, endPage) {

    return new Promise(async (resolve,reject) => {

        global.lastReptileTime = global.lastReptileTime || 0;

        let nowDateTime = new Date().getTime();

        if(nowDateTime - global.lastReptileTime <= 30*60*1000){
            reject(`半个小时内，不允许再次爬取代理IP`);
            return;
        }

        if(global.removeRepeat) {
            reject(`代理IP正在去重中，请稍后再试`);
            return;
        }

        if(global.reptileIp) {
            reject(`代理IP正在爬取中，请耐心等待`);
            return;
        }
        global.reptileIp = true;

        startIpReptile(startPage, endPage, async function() {
            //这里后续添加一个redis去重功能  //不知道要不要加
            global.reptileIp = false;
            global.lastReptileTime = new Date().getTime();
            resolve(`代理IP爬取完毕`);
        });
    })

}


module.exports = startReptile;
