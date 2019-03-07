const getBooksFromJson = require("../../reptileTool/getBooksFromJson.js");



const startReptile = async () => {
    return new Promise(async (resolve, reject) => {

        // reject("mysql服务器爆棚，暂不允许爬取");
        // return;
        let startTime = new Date().getTime();
        if(global.isReptile) {
            if((startTime - (global.reptileLastTime || 0)) > 1000*60*60){  //距离上次爬取超过一个小时
                global.isReptile = false;
            }
        }
        if(global.isReptile) {
            reject("正在爬取中...")
        } else {
            global.reptileLastTime = startTime;
            global.isReptile = true;
            getBooksFromJson(() => {
                global.isReptile = false;
            });
            resolve("开始爬取");
        }
    });
}





module.exports = startReptile;