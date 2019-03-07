const { oauth, tool, db, log, rp, cheerio, iconv,request } = require("../../tool/require");
let reptileCommon = [
    {
        code:"gbk",
        name:"笔趣阁1",
        baseUrl:"http://www.biquge.com.tw/",
        searchUrl:(bookName) => {  /*返回搜索地址*/
            return "http://www.biquge.com.tw/modules/article/soshu.php?searchkey=+" + tool.encodeURIComponent_GBK(bookName)
        },
        getBookList: ($, url) => {
            let list = [];
            if(url.indexOf("/modules/article/soshu.php") == -1) {
                //302重定向，进入了书的详情页
                list.push({
                    title:$("#info>h1").html(),
                    url: (url.indexOf("http") == -1) ? ("http://www.biquge.com.tw" + url) : url,
                    author:$("#info>p").eq(0).html().split("：")[1],
                    status:$("#info>p").eq(2).html()
                })
            } else {
                let domList = $(".grid").find("tr");
                let i = 0, length = domList.length;
                for(i; i<length; i++){
                    let a = domList.eq(i).find("td").first().find("a");
                    let author = domList.eq(i).find("td").eq(2).html();
                    if(a.html()) {
                        list.push({
                            title:a.html(),
                            url:a.attr("href"),
                            author:author,
                            status:domList.eq(i).find("td").last().html() + " ____ 最后更新：" + domList.eq(i).find("td").eq(4).html()
                        });
                    }
                }
            }
            return list;
        },
        bookTitle: ($) => {
            return $("#info>h1").html();
        },
        bookAuthor: ($) => {
            let author2 = $($("#info>p")[0]).html() || "";
            let author = author2.split("：").length <= 1 ? author2 : author2.split("：")[1];
            return author;
        },
        getUpdateTime: ($) => {
            let updateTime2 = $("#info>p").eq(2).html();
            let updateTime = updateTime2.split("：").length <= 1 ? updateTime2 : updateTime2.split("：")[1];
            return updateTime;
        },
        beforeThreeDay: () => {
            var date = new Date();//获取当前时间
            date.setDate(date.getDate() - 3);//设置天数 -3 天
            return date;
        },
        getCatalogList: ($) => {
            return $("#list a");
        },
        getCatalogFirstNum: ($) => {
            return 0;
        },
        getBookType: ($) => {
            return ((typeof $(".con_top").html().split(" > ")[1]) == "string") ? $(".con_top").html().split(" > ")[1].trim() : "";
        },
        getBookImgUrl: ($) => {
            return $("#fmimg>img").attr("src");
        },
        getDescription: ($) => {
            return $("#intro>p").html();
        },
        getCatalog: ($, catalogStr, i) => {
            let catalog = $(catalogStr[i]);
            let title = catalog.html();
            let type = 1;  //1带章节
            if (title.indexOf("章") == -1 && title.indexOf("第") == -1) {
                type = 2;   //2没有章节
            }
            // console.log(title);
            return {
                // title:type == 1 ? (title.split("章")[1] || title.split("章")[0]).trim() : title,
                title: title,
                // href: "/" + catalog.attr("href").split("/")[2],
                href: "/" + catalog.attr("href").split("/")[catalog.attr("href").split("/").length - 1],
                type: type,
            };
        },
        getCatalogContent: ($) => {
            // let reg = /<a[^>]*>[^<]*<\/a>/gi;   //过滤a标签  过滤a标签有问题
            let content = $("#content").html().replace(/\n/g, "");
            content = tool.filterHtmlOrContainer(content|| "");  // 除br之外，其他标签全部过滤
            let contentArr = content.split("<br>");
            let i = 0, length = contentArr.length;
            for(i; i<length; i++) {
                if(!contentArr[i] || contentArr[i].trim() == "") {
                    contentArr.splice(i,1);
                    i--;
                    length--;
                } else {
                    contentArr[i] = contentArr[i] && contentArr[i].trim();
                }
            }
            return contentArr.join("<br>");
        }
    },
    {
        code:"gbk",
        name:"笔趣阁小说网",
        baseUrl:"http://www.biqugexsw.com/",
        searchUrl:(bookName) => {
            return "http://www.biqugexsw.com/s.php?ie=gbk&s=2758772450457967865&q=" + tool.encodeURIComponent_GBK(bookName)
        },
        getBookList: ($) => {
            let list = [];
            let domList = $(".bookbox");
            let i = 0, length = domList.length;
            for(i; i<length; i++) {
                list.push({
                    title: domList.eq(i).find(".bookname>a").html(),
                    url : "http://www.biqugexsw.com" + domList.eq(i).find(".bookname>a").attr("href"),
                    author: domList.eq(i).find(".author").html().split("作者：")[1],
                    status: domList.eq(i).find(".cat").html().split("分类：")[1]
                })
            }
            return list;
        },
        bookTitle: ($) => {
            return $(".info>h2").html();
        },
        bookAuthor: ($) => {
            return $(".small>span").eq(0).html().split("作者：")[1];
        },
        getUpdateTime: ($) => {
            let updateTime2 = new Date($(".small>span").eq(4).html().split("更新时间：")[1]);
            return updateTime2.Format("yyyy-MM-dd hh:mm:ss");
        },
        beforeThreeDay: () => {
            var date = new Date();//获取当前时间
            date.setDate(date.getDate() - 3);//设置天数 -3 天
            return date;
        },
        getCatalogList: ($) => {
            return $(".listmain a");
        },
        getCatalogFirstNum: ($) => {
            if($(".listmain>dl>dt").length == 1) {
                return 0;
            } else {
                return $(".listmain>dl>dt").eq(1).index() - 1;
            }
        },
        getBookType: ($) => {
            return $(".small>span").eq(1).html().split("分类：")[1];
        },
        getBookImgUrl: ($) => {
            return $(".info>.cover>img").attr("src");
        },
        getDescription: ($) => {
            return $(".intro").html().split("</span>")[1].split("<br>")[0].trim();
        },
        getCatalog: ($, catalogStr, i) => {
            let catalog = catalogStr.eq(i);
            let title = catalog.html();
            let type = 1;  //1带章节
            if (title.indexOf("章") == -1 && title.indexOf("第") == -1) {
                type = 2;   //2没有章节
            }
            // console.log(title);
            return {
                // title:type == 1 ? (title.split("章")[1] || title.split("章")[0]).trim() : title,
                title: title,
                href: "/" + catalog.attr("href").split("/")[catalog.attr("href").split("/").length - 1],
                type: type,
            }
        },
        getCatalogContent: ($) => {
            // let reg = /<a[^>]*>[^<]*<\/a>/gi;   //过滤a标签
            // let content = $("#content").html().replace(/&nbsp;/g, "").replace(/\n/g, "").replace(reg, "");
            let content =  $("#content").html().replace(/&nbsp;/g, "").replace(/\n/g, "");
            content = tool.filterHtmlOrContainer(content|| "");  // 除br之外，其他标签全部过滤
            let contentArr = content.split("<br>");
            let i = 0, length = contentArr.length;
            for(i; i<length; i++) {
                if(!contentArr[i] || contentArr[i].trim() == "") {
                    contentArr.splice(i,1);
                    i--;
                    length--;
                } else {
                    contentArr[i] = contentArr[i] && contentArr[i].trim();
                }
            }
            contentArr.splice(contentArr.length - 2 , 2);
            return contentArr.join("<br>");
        }
    },
    {
        code:"gbk",
        name: "笔趣阁5200",
        baseUrl:"https://www.biquge5200.cc/",
        searchUrl:(bookName) => {
            return "https://www.biquge5200.cc/modules/article/search.php?searchkey=" + tool.url_encode(bookName)  //utf-8编码搜索
        },
        getBookList: ($, url) => {
            let list = [];

            let domList = $(".grid").find("tr");
            let i = 0, length = domList.length;
            for(i; i<length; i++){
                let a = domList.eq(i).find("td").first().find("a");
                let author = domList.eq(i).find("td").eq(2).html();
                if(a.html()) {
                    list.push({
                        title:a.html(),
                        url:a.attr("href"),
                        author:author,
                        status:domList.eq(i).find("td").last().html() + " ____ 最后更新：" + domList.eq(i).find("td").eq(4).html()
                    });
                }
            }

            return list;
        },
        bookTitle: ($) => {
            return $("#info>h1").html();
        },
        bookAuthor: ($) => {
            let author2 = $($("#info>p")[0]).html() || "";
            let author = author2.split("：").length <= 1 ? author2 : author2.split("：")[1];
            return author;
        },
        getUpdateTime: ($) => {
            let updateTime2 = $("#info>p").eq(2).html() || "";
            let updateTime = updateTime2.split("：").length <= 1 ? updateTime2 : updateTime2.split("：")[1];
            return updateTime;
        },
        beforeThreeDay: () => {
            var date = new Date();//获取当前时间
            date.setDate(date.getDate() - 3);//设置天数 -3 天
            return date;
        },
        getCatalogList: ($) => {
            return $("#list a");
        },
        getCatalogFirstNum: ($) => {
            if($("#list>dl>dt").length == 1) {
                return 0;
            } else {
                return $("#list>dl>dt").eq(1).index() - 2;
            }
        },
        getBookType: ($) => {
            return $(".con_top>a").eq(1).html();
        },
        getBookImgUrl: ($) => {
            return $("#fmimg>img").attr("src");
        },
        getDescription: ($) => {
            if($("#intro>p").html().trim()) {
                return tool.filterHtmlOrContainer($("#intro>p").html() || "");
            } else if($("#intro>p").eq(1).html()) {
                return tool.filterHtmlOrContainer($("#intro>p").eq(1).html() || "");
            } else if($("#intro>p").eq(2).html()){
                return tool.filterHtmlOrContainer($("#intro>p").eq(2).html() || "");
            }

        },
        getCatalog: ($, catalogStr, i) => {
            let catalog = $(catalogStr[i]);
            let title = catalog.html();
            let type = 1;  //1带章节
            if (title.indexOf("章") == -1 && title.indexOf("第") == -1) {
                type = 2;   //2没有章节
            }
            // console.log(title);
            return {
                // title:type == 1 ? (title.split("章")[1] || title.split("章")[0]).trim() : title,
                title: title,
                // href: "/" + catalog.attr("href").split("/")[2],
                href: "/" + catalog.attr("href").split("/")[catalog.attr("href").split("/").length - 1],
                type: type,
            };
        },
        getCatalogContent: ($) => {
            // let reg = /<a[^>]*>[^<]*<\/a>/gi;   //过滤a标签
            let content = $("#content").html() ? $("#content").html().replace(/\n/g, "").replace(/<p>/g, "<br>").replace(/<\/p>/g, "<br>") : "";
            content = tool.filterHtmlOrContainer(content|| "");  // 除br之外，其他标签全部过滤
            let contentArr = content.split("<br>");
            let i = 0, length = contentArr.length;
            for(i; i<length; i++) {
                if(!contentArr[i] || contentArr[i].trim() == "") {
                    contentArr.splice(i,1);
                    i--;
                    length--;
                } else {
                    contentArr[i] = contentArr[i] && contentArr[i].trim();
                }
            }
            return contentArr.join("<br>");
        }
    },
    {
        code:"utf-8",
        name:"笔趣阁备用站",
        baseUrl:"https://www.biquge.cc/",
        searchUrl:(bookName) => {
            return "https://sou.xanbhx.com/search?t=920895234054625192&siteid=biqugecc&q=" + tool.url_encode(bookName)
        },
        getBookList: ($, url) => {
            let list = [];

            let domList = $(".search-list>ul>li");
            let i = 1, length = domList.length;
            for(i; i<length; i++){
                let a = domList.eq(i).find(".s2>a");
                let author = domList.eq(i).find(".s4").html();
                if(a.html()) {
                    list.push({
                        title:a.html()?a.html().trim():a.html(),
                        url:a.attr("href"),
                        author:author,
                        status:domList.eq(i).find(".s7").html() + " ____ 最后更新：" + domList.eq(i).find(".s6").html()
                    });
                }
            }

            return list;
        },
        bookTitle: ($) => {
            return $("#info>h1").html();
        },
        bookAuthor: ($) => {
            let author2 = $($("#info>p")[0]).html() || "";
            let author = author2.split("：").length <= 1 ? author2 : author2.split("：")[1];
            return author;
        },
        getUpdateTime: ($) => {
            let updateTime2 = $("#info>p").eq(2).html() || "";
            let updateTime = updateTime2.split("：").length <= 1 ? updateTime2 : updateTime2.split("：")[1];
            return updateTime;
        },
        beforeThreeDay: () => {
            var date = new Date();//获取当前时间
            date.setDate(date.getDate() - 3);//设置天数 -3 天
            return date;
        },
        getCatalogList: ($) => {
            return $("#list a");
        },
        getCatalogFirstNum: ($) => {
            if($("#list>dl>dt").length == 1) {
                return 0;
            } else {
                return $("#list>dl>dt").eq(1).index() - 1;
            }
        },
        getBookType: ($) => { //暂无
        // 《梦入斗破》情节跌宕起伏、扣人心弦，是一本情节与文笔俱佳的小说同人小说，笔趣阁转载收集梦入斗破最新章节。
        // 《通天神捕》情节跌宕起伏、扣人心弦，是一本情节与文笔俱佳的武侠仙侠小说，笔趣阁转载收集通天神捕最新章节。
            let footer = $(".footer_cont>p").eq(0).html();
            let filter = footer.match(/情节与文笔俱佳的.*小说/)[0].replace("情节与文笔俱佳的","");
            let bookType = ""
            if(filter.substr(0,2) == "小说") {  //小说同人小说
                bookType = filter.substr(2,2);
            } else {
                bookType = filter.substr(0,2);
            }
            bookType += "小说";
                // 情节与文笔俱佳的.*小说
            return bookType;
        },
        getBookImgUrl: ($) => {
            return $("#fmimg>img").attr("src");
        },
        getDescription: ($) => {
            return tool.filterHtmlOrContainer(($("#intro").html()?$("#intro").html().trim():"")|| "");
        },
        getCatalog: ($, catalogStr, i) => {
            let catalog = $(catalogStr[i]);
            let title = catalog.html();
            let type = 1;  //1带章节
            if (title.indexOf("章") == -1 && title.indexOf("第") == -1) {
                type = 2;   //2没有章节
            }
            return {
                // title:type == 1 ? (title.split("章")[1] || title.split("章")[0]).trim() : title,
                title: title,
                // href: "/" + catalog.attr("href").split("/")[2],
                href: "/" + catalog.attr("href").split("/")[catalog.attr("href").split("/").length - 1],
                type: type,
            };
        },
        getCatalogContent: ($) => {
            // let reg = /<a[^>]*>[^<]*<\/a>/gi;   //过滤a标签
            let content = $("#content").html() ? $("#content").html().replace(/\n/g, "").replace(/<p>/g, "<br>").replace(/<\/p>/g, "<br>") : "";
            content = tool.filterHtmlOrContainer(content|| "");  // 除br之外，其他标签全部过滤
            let contentArr = content.split("<br>");
            let i = 0, length = contentArr.length;
            for(i; i<length; i++) {
                if(!contentArr[i] || contentArr[i].trim() == "") {
                    contentArr.splice(i,1);
                    i--;
                    length--;
                } else {
                    contentArr[i] = contentArr[i] && contentArr[i].trim();
                }
            }
            return contentArr.join("<br>");
        }
    }
]


module.exports = reptileCommon;