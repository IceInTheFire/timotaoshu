const getBooksFromJson = require("../../reptileTool/getBooksFromJson.js");



const startReptile = async () => {
    return new Promise(async (resolve, reject) => {
        if(global.isReptile) {
            let startTime = new Date().getTime();
            if(startTime - (global.reptileLastTime || 0) > 1000*60*60){  //距离上次爬取超过一个小时
                global.isReptile = false;
            }
            global.reptileLastTime = startTime;
        }

        if(global.isReptile) {
            reject("正在爬取中...")
        } else {
            global.isReptile = true;
            getBooksFromJson(() => {
                global.isReptile = false;
            });
            resolve("开始爬取");
        }
    });
}





module.exports = startReptile;