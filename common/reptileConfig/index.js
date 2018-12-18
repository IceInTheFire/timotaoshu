const { oauth, tool, db, log } = require("../tool/require");


async function getReptileList(){
    let count = await tool.redisData.reptileList.getReptileCount();
    if(!count) {
        /*
        * 以后弄一个common服务，专门弄一个定时任务。。
        * 下面这种写法，目测没问题，但是并发量上去了则会出现一些不可控的bug
        * */
        // let allData = await db.query(`select id,codeType,originUrl,remark from reptiletool`);
        let allData = await db.query(`select * from reptiletool2`);
        // tool.redisData.reptileList.setReptileList(allData);
        tool.redisData.reptileList.updateReptileList(allData);
    }

    count = await tool.redisData.reptileList.getReptileCount();
    // reptileList = await tool.redisData.reptileList.getReptileList((page-1)*limit, page*limit-1);
    return await tool.redisData.reptileList.getReptileList(0, count-1);
}

/*
* 更新redis里的reptile配置数据
* */
async function refreshReptileList() {
    let allData = await db.query(`select * from reptiletool2`);
    await tool.redisData.reptileList.updateReptileList(allData);
    let count = await tool.redisData.reptileList.getReptileCount();
    return await tool.redisData.reptileList.getReptileList(0, count-1);
}

/*
* 获取规则
* */
async function getReptileRule(){
    let reptileList = await getReptileList();
    let rules = {};
    reptileList.forEach((value,index) => {
        let value2 = JSON.parse(value);
        rules[value2.reptileTypeId] = value2;
    });
    return rules;
}




module.exports = {
    getReptileList,
    refreshReptileList,
    getReptileRule
};