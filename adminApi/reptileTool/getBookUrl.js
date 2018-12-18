const {rp,timoRp, cheerio, iconv, tool,log} = require("../tool/require");
// const reptileCommon = require("./common/reptileCommon");
const reptileCommon2 = require("./common/reptileCommon2");

/*
* 通过 url 获取
* 获取书的url地址
* */

async function getBookUrl_common(reptileType, bookName, isProxy){
    let reptileCommon = await reptileCommon2(reptileType);
    let option = {
        // uri:'https://www.biquge5200.cc/modules/article/search.php?searchkey=' + tool.url_encode(bookName),
        uri:reptileCommon.searchUrl(bookName),
        encoding : null,
        transform: function(body, response) {
            return [cheerio.load(iconv.decode(body, reptileCommon.code),{decodeEntities: false}), response.req.path];
        },
        timeout: 5000,
        headers:{
            "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36"
        }
    };

    if(isProxy && global.server) {
        option.proxy = global.serverProxy
    } else {
        let ip = await tool.redisData.ipList.getRandomIpList();
        if(ip) option.proxy = ip;
    }

    return new Promise((resolve,reject) => {
        timoRp(option).then(function(data){
            let $ = data[0];
            let url = data[1];
            let list = reptileCommon.getBookList($, url);
            // callback && callback(list)
            resolve(list);
        }).catch(function(err){
            // errorCallback && errorCallback(err);
            log.error(err);
            resolve(err);
        });
    });

};


module.exports = (reptileType, bookName, isProxy) => {
    return getBookUrl_common(parseInt(reptileType), bookName, isProxy);
}
