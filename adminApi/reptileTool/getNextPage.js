const {fs, rp, timoRp, cheerio, iconv, path, tool, db, log} = require("../tool/require2");
// 下一页目录
async function getNextPage({$, reptileCommon}){
    let result = null, count = 0;
    while(!result && count <= 10) {
        let option2 = {
            uri: reptileCommon.getNextPage($),
            userAgent: reptileCommon.userAgent,
            encoding: null,
            transform: function (body) {
                // let body2 = iconv.decode(body, "gbk");  //用来查看页面
                return cheerio.load(iconv.decode(body, reptileCommon.code), {decodeEntities: false});
            }
        }
        try{
            result = await timoRp(option2);
        } catch(err) {
            count++;
            log.error(`爬取失败：${err}，第${count}次失败，失败地址：${option2.uri}失败代理ip：${option2.proxy}`);
        }
    }
    return result;
}

module.exports = getNextPage;