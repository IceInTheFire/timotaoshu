let startIpReptile = require("../../reptileTool/ip/startIpReptile");

async function startReptile(startPage, endPage) {

    return new Promise(async (resolve,reject) => {
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
            resolve(`代理IP爬取完毕`);
        });
    })

}


module.exports = startReptile;