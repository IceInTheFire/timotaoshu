// const { oauth, tool, db, log,timoRp } = require("../../tool/require2");
const {fs, rp,timoRp, cheerio, iconv, path, tool, log, db, queue} = require("../../tool/require2");
const getBookCatalogJson = require("../../reptileTool/getBookCatalogJson");


startRp()


//爬取该地址www.biquge5200.cc所有小说  若渠道未失效，这个可以使用

//渠道id需要注意。本页45行的   2  是渠道id    若不清楚这个渠道id，则可以在群里问下
async function startRp() {
    let option = {
        uri: "https://www.biquge5200.cc/xiaoshuodaquan/",
        encoding: null,
        transform: function (body) {
            // let body2 = iconv.decode(body, "gbk");  //用来查看页面
            return cheerio.load(iconv.decode(body, "gbk"), {decodeEntities: false});
        },
        headers: {
            //模拟谷歌浏览器
            "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36"
        },
        timeout:20000
        // timeout:500
    }

    let ip = await tool.redisData.ipList.getRandomIpList();
    if(ip) option.proxy = ip;
    timoRp(option).then(async ($)=>{
        let aArr = $(".novellist ul li a");
        let length = aArr.length;
        let i = 0;
        let count = 0;
        let successCount = 0;
        let errorCount = 0;
        let allBook = 0;
        for(i;i<length;i++) {
            (async function(i){
                let bookName = aArr.eq(i).html();

                let books = await db.query(`select * from book where name="${bookName}"`);
                if(!books.length) {
                    allBook++;
                    tool.queue.push({
                        params: [2, "http:"+aArr.eq(i).attr("href"),success,error],
                        pro: getBookCatalogJson,
                        result: async (data) => {

                        },
                        error: async (data) => {

                        }
                    });

                    function success(data){
                        count++;
                        successCount++;
                        // console.log(`爬取第${count}本书json完毕：${data}`);
                        console.log(`爬取第${count}本json成功，当前成功数为${successCount},共${allBook}本`);
                    }
                    function error(err){
                        count++;
                        errorCount++;
                        // console.log(`爬取失败：${err}`);
                        console.log(`爬取第${count}本json失败，当前失败数为${errorCount},共${allBook}本`);
                        // console.log("爬取一本书json失败：");
                    }
                }


            })(i);
        }
    }).catch((err)=>{
        console.log("爬取失败");
        console.log(err);
    })
}