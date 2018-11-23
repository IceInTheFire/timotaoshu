const {rp,timoRp, cheerio, iconv, tool,log} = require("../tool/require");
const reptileCommon = require("./common/reptileCommon");

/*
* 通过 url 获取
* 获取书的url地址
* */

async function getBookUrl_common(reptileType, bookName, callback, errorCallback, isProxy){
    let option = {
        // uri:'https://www.biquge5200.cc/modules/article/search.php?searchkey=' + tool.url_encode(bookName),
        uri:reptileCommon[reptileType].searchUrl(bookName),
        encoding : null,
        transform: function(body, response, resolveWithFullResponse) {
            return [cheerio.load(iconv.decode(body, reptileCommon[reptileType].code),{decodeEntities: false}), response.req.path];
        },
        timeout: 10000,
        headers:{
            "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36"
        }
    };

    if(isProxy) {
        global.server && (option.proxy = global.serverProxy);
    }

    timoRp(option).then(function(data){
        let $ = data[0];
        let url = data[1];
        let list = reptileCommon[reptileType].getBookList($, url);
        callback && callback(list)
    }).catch(function(err){
        log.error(err);
        errorCallback && errorCallback(err);
        log.error(err);
    });
};


module.exports = (reptileType, bookName, callback, errorCallback, isProxy) => {
    var reptileType = parseInt(reptileType);
    return getBookUrl_common(reptileType, bookName, callback, errorCallback, isProxy);
}
