const { oauth, tool, db, log } = require("../../tool/require");



async function removeRepeat() {
    return new Promise(async (resolve, reject) => {
        if(global.reptileIp) {
            reject(`代理IP正在爬取中，请稍后再试`);
            return;
        }

        if(global.removeRepeat) {
            reject(`代理IP正在去重中，请耐心等待`)
            return;
        }
        global.removeRepeat = true;
        try{

            let ipList = await tool.redisData.ipList.getAllIpList();
            let ipList2 = tool.distinct(ipList);
            await tool.redisData.ipList.updateIpList(ipList2);
            global.removeRepeat = false;
            resolve(`代理IP去重完毕`);
        }catch(err){
            global.removeRepeat = false;
            log.error(err);
            reject(`代理ip去重失败，错误原因:${err}`);
        }
    })
}




module.exports = removeRepeat;