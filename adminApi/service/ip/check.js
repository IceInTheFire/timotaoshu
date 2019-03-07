const { oauth, tool, db, log } = require("../../tool/require");
let checkIp = require("../../reptileTool/ip/checkIp");


async function check() {
    return new Promise(async (resolve,reject) => {
        if(global.checkIp) {
            reject(`检查代理IP的功能，正在被占用中，请稍候`);
            return;
        }
        if(global.delIp) {
            reject(`删除代理IP的功能，正在被占用中，请稍候`);
            return;
        }
        global.checkIp = true;
        global.delIp = true;
        let allIpList = await tool.redisData.ipList.getAllIpList();
        let i = 0, length = allIpList.length;
        let indexArr = [];      //失败的index索引
        let successArr = [];    //成功的index索引
        let allArr = [];        //全部的index索引
        let yu = length > 10 ? Math.ceil(length/20) :  (length > 1 ?1:0);   //允许有几个个缺失  默认丢弃最后几个未返回的
        let needCount = length - yu;
        let overLength = 0;
        for(i; i<length; i++) {
            let params = JSON.parse(allIpList[i]);
            params.i = i;
            allArr.push(i);
            tool.ipQueue.push({
                params:[params],
                pro:checkIp,
                result:(data, isTrue, err) => {
                    overLength ++;
                    if(overLength > needCount) return;
                    if(isTrue) {
                        successArr.push(data.i);
                        log.info(`${data.protocol}://${data.ip}:${data.port}可以访问，当前第${overLength}条，共${length}条IP需要检查`);
                    } else {
                        indexArr.push(data.i);
                        try{
                            log.error(`${data.protocol}://${data.ip}:${data.port}不可以访问，当前第${overLength}条，共${length}条IP需要检查，不可访问原因：${err}`);
                        } catch(err2) {
                            log.error(`当前第${overLength}条，共${length}条IP需要检查，不可访问原因：1、${err2}，2、${err}`);
                        }
                    }
                    if(overLength == needCount) {   //ipQuequ的最后一个返回过慢，用排除法查出来，然后自动放入error里
                        allFinish();
                    }
                },
                error: () => {
                    log.error("由于未知原因，来到了这里，需警惕");
                    overLength++;
                    if(overLength > needCount) return;
                    if(overLength == needCount) {   //ipQuequ的最后一个返回过慢，用排除法查出来，然后自动放入error里
                        allFinish();
                    }
                }
            }, (err) => {});
        }

        async function allFinish(){
            if(indexArr.length > 0 && (allArr.length - successArr.length - indexArr.length) > 0) {
                // let indexArr = [];      //失败的index索引
                // let successArr = [];    //成功的index索引
                // let allArr = [];        //全部的index索引
                try{
                    let leakIndexArr = allArr.removeArr(successArr).removeArr(indexArr);
                    // if(leakIndexArr.length > 0) {
                    //     await tool.redisData.ipList.delIpFromIndex(leakIndexArr.join(","))
                    // }
                    let result = await tool.redisData.ipList.delIpFromIndex(indexArr.concat(leakIndexArr).join(","));
                    global.delIp = false;
                    global.checkIp = false;
                    if(result) {
                        log.info(`检查了${length}条代理IP,删除了${indexArr.length + leakIndexArr.length}条代理IP`);
                        resolve({successMsg:`检查了${length}条代理IP,删除了${indexArr.length + leakIndexArr.length}条代理IP`})
                    } else {
                        log.error(`删除失败`);
                        reject(`删除失败`);
                    }
                } catch(err) {
                    log.error(`删除失败，失败原因：${err}`);
                    global.delIp = false;
                    global.checkIp = false;
                    reject(`删除失败，失败原因：${err}`);
                }
            } else {
                global.checkIp = false;
                global.delIp = false;
                resolve({msg:`检查了${length}条代理IP,删除了0条代理IP`})
            }
        }
    });
}


module.exports = check;