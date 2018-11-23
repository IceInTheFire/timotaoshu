

const { oauth, tool, db, log, rp,timoRp, request, cheerio, iconv } = require("../../tool/require");

/*
* 西刺
* */
async function getIpList(page) {
    return new Promise(async (resolve, reject) => {
        let option = {
            uri:'http://www.xicidaili.com/wt/' + page,
            encoding : null,
            transform: function(body, response, resolveWithFullResponse) {
                // let body2 = iconv.decode(body, 'utf-8');  //用来查看页面
                // console.log(body2);
                return [cheerio.load(iconv.decode(body, 'utf-8'),{decodeEntities: false}), response.req.path];
            },
            headers:{
                "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36",
                // "X-Forwarded-For":'61.135.217.7',
                // 'x-real-ip':'61.135.217.7'
            },
            timeout:20000
        };
        // let ip = await tool.redisData.ipList.getRandomIpList();
        // if(ip) option.proxy = ip;

        timoRp(option).then(function(data){
            let $ = data[0];
            let ipList = $("#ip_list tr");
            let i = 1, length = ipList.length;
            let ipArr = [];
            for(i; i<length; i++) {
                let value = ipList.eq(i);
                ipArr.push({
                    ip: value.find("td").eq(1).html(),
                    port: value.find("td").eq(2).html(),
                    address: value.find("td").eq(3).find("a").html() ? value.find("td").find("a").html().trim() : "",
                    status: value.find("td").eq(4).html() ? value.find("td").eq(4).html().trim() : "",
                    protocol: value.find("td").eq(5).html() ? value.find("td").eq(5).html().toLowerCase() : "",
                    from: '西刺代理',
                    fromHref: 'http://www.xicidaili.com/wt/',
                    responseTime: value.find("td").eq(6).find('.bar').attr("title") ? value.find("td").eq(6).find('.bar').attr("title").trim() : ""
                });
            }

            let allPage = $(".pagination>a").eq(-2).html();
            resolve({
                ipArr,
                allPage
            });
        }).catch(function(err){
            log.error(err);
            // resolve(false);
            reject();
        });
    });
};

/*
* 快代理
* */
async function getIpList2(page) {
    return new Promise(async (resolve, reject) => {
        let option = {
            uri:'https://www.kuaidaili.com/free/inha/' + page,
            encoding : null,
            transform: function(body, response, resolveWithFullResponse) {
                // let body2 = iconv.decode(body, 'utf-8');  //用来查看页面
                // console.log(body2);
                return [cheerio.load(iconv.decode(body, 'utf-8'),{decodeEntities: false}), response.req.path];
            },
            headers:{
                "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36"
            },
            timeout:20000
        };
        // let ip = await tool.redisData.ipList.getRandomIpList();
        // if(ip) option.proxy = ip;

        rp(option).then(function(data){
            let $ = data[0];
            let ipList = $("table>tbody>tr");
            let i = 0, length = ipList.length;
            let ipArr = [];
            for(i; i<length; i++) {
                let value = ipList.eq(i);
                ipArr.push({
                    ip: value.find("td").eq(0).html(),
                    port: value.find("td").eq(1).html(),
                    address: value.find("td").eq(4).html() ? value.find("td").eq(4).html().trim() : "",
                    status: value.find("td").eq(2).html() ? value.find("td").eq(2).html().trim() : "",
                    protocol: value.find("td").eq(3).html() ? value.find("td").eq(3).html().toLowerCase() : "",
                    from:'快代理',
                    fromHref:'https://www.kuaidaili.com/free/inha/',
                    responseTime:value.find("td").eq(5).html() ? value.find("td").eq(5).html().trim() : ""
                });
            }

            let allPage = $("#listnav>ul>li").eq(-2).find("a").html();
            resolve({
                ipArr,
                allPage
            });
        }).catch(function(err){
            log.error(err);
            // resolve(false);
            reject();
        });
    });
};

/*
* 需要翻墙的
* */
async function getIpList3(page) {
    return new Promise(async (resolve, reject) => {
        let option = {
            uri:'https://www.us-proxy.org',
            encoding : null,
            transform: function(body, response, resolveWithFullResponse) {
                // let body2 = iconv.decode(body, 'utf-8');  //用来查看页面
                // console.log(body2);
                return [cheerio.load(iconv.decode(body, 'utf-8'),{decodeEntities: false}), response.req.path];
            },
            headers:{
                "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36"
            },
            timeout:20000
        };
        // let ip = await tool.redisData.ipList.getRandomIpList();
        // if(ip) option.proxy = ip;

        rp(option).then(function(data){
            let $ = data[0];
            let ipList = $(".table>tbody>tr");
            console.log(ipList);
            let i = 0, length = ipList.length;
            let ipArr = [];
            for(i; i<length; i++) {
                let value = ipList.eq(i);
                ipArr.push({
                    ip: value.find("td").eq(0).html(),
                    port: value.find("td").eq(1).html(),
                    address: value.find("td").eq(4).html() ? value.find("td").html().trim() : "",
                    status: value.find("td").eq(2).html() ? value.find("td").eq(4).html().trim() : "",
                    protocol: value.find("td").eq(3).html() ? value.find("td").eq(5).html().toLowerCase() : ""
                });
            }

            let allPage = 1;
            resolve({
                ipArr,
                allPage
            });
        }).catch(function(err){
            log.error(err);
            // resolve(false);
            reject();
        });
    });
};

/*
* 开心代理
* */
async function getIpList4(page) {
    return new Promise(async (resolve, reject) => {
        let option = {
            uri:'http://ip.kxdaili.com/ipList/' + page + '.html#ip',
            encoding : null,
            transform: function(body, response, resolveWithFullResponse) {
                // let body2 = iconv.decode(body, 'utf-8');  //用来查看页面
                return [cheerio.load(iconv.decode(body, 'utf-8'),{decodeEntities: false}), response.req.path];
            },
            headers:{
                "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36"
            },
            timeout:20000
        };
        // let ip = await tool.redisData.ipList.getRandomIpList();
        // if(ip) option.proxy = ip;

        rp(option).then(function(data){
            let $ = data[0];
            let ipList = $(".table>tbody>tr");
            let i = 0, length = ipList.length;
            let ipArr = [];
            for(i; i<length; i++) {
                let value = ipList.eq(i);
                ipArr.push({
                    ip: value.find("td").eq(0).html(),
                    port: value.find("td").eq(1).html(),
                    address: value.find("td").eq(5).html() ? value.find("td").eq(5).html().trim() : "",
                    status: value.find("td").eq(2).html() ? value.find("td").eq(2).html().trim() : "",
                    protocol: "http",
                    from:'开心代理',
                    fromHref:'http://ip.kxdaili.com',
                    responseTime:value.find("td").eq(4).html() ? value.find("td").eq(4).html().trim() : ""
                });
            }

            let allPage = $(".page>a").eq(-2).html();
            resolve({
                ipArr,
                allPage
            });
        }).catch(function(err){
            log.error(err);
            // resolve(false);
            reject()
        });
    });
};

// module.exports = getIpList2;
module.exports = async (page) => {
    return new Promise((resolve, reject) => {
        Promise.all([getIpList(page), getIpList2(page), getIpList4(page)]).then((data) => {
            let allPage = data[0].allPage;
            let ipArr = [];
            data.forEach((value, index) => {
                if(allPage > value.allPage) allPage = value.allPage;
                ipArr = ipArr.concat(value.ipArr);
            });

            if(!allPage) allPage = 3;
            resolve({
                ipArr,
                allPage
            });
        }).catch((err) => {
            log.error(err);
            resolve(false);
        });
    });
};




// 用来检测是什么代理
// http://ip.chinaz.com/getip.aspx
// https://ipinfo.io/


// 获取ip代理列表
// http://www.xicidaili.com/
// http://www.xicidaili.com/wn  // 国内高匿代理  https
// http://www.xicidaili.com/wt  // 国内高匿代理  http
// https://www.kuaidaili.com/free/inha/2/   快代理