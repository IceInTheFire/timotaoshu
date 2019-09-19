const {rp,timoRp, cheerio, iconv, tool,log, db} = require("../tool/require");
// const reptileCommon = require("./common/reptileCommon");
const reptileCommon2 = require("./common/reptileCommon2");

/*
* 通过 url 获取
* 获取书的url地址
* */

async function getBookUrl_common(reptileType, bookName, isProxy){
    return new Promise(async (resolve,reject) => {
        let reptileCommon = await reptileCommon2(reptileType);
        if(!reptileCommon) {
            resolve(`没有该来源配置,`);
            return;
        }
        let option = {
            uri: reptileCommon.searchUrl(bookName),
            userAgent: reptileCommon.userAgent,
            encoding : null,
            transform: function(body, response) {
                let body2 = iconv.decode(body, "gbk");  //用来查看页面
                return [cheerio.load(iconv.decode(body, reptileCommon.code),{decodeEntities: false}), response.req.path];
            },
            timeout: 10000,
            noProxy: true,
        };

        try{
            let data = await timoRp(option);
            let $ = data[0];
            let url = data[1];
            let list = reptileCommon.getBookList($, url, bookName);
            // callback && callback(list)
            resolve(list);
        }catch(err){
            // errorCallback && errorCallback(err);
            log.error(err);
            resolve(err);
        }
    });

};


module.exports = async (reptileType, bookName, isProxy) => {
    reptileType = parseInt(reptileType);
    return getBookUrl_common(reptileType, bookName, isProxy);
}
