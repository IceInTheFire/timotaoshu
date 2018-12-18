var express = require('express');
var router = express.Router();
const { oauth, tool, db,log} = require("../../tool/require");
const getBookUrl = require("../../reptileTool/getBookUrl");

/*
*   获取书的url地址
* */
router.use('', oauth(4002),  async function(req, res, next) {
    let bookName = tool.getParams(req, 'bookName');
    let reptileType = tool.getParams(req, 'reptileType') || 0;
    let isProxy = tool.getParams(req, 'isProxy') || "true";
    if(isProxy == "true")
        isProxy = true;
    else
        isProxy = false;
    try{

        let reptileTypeArr = reptileType.split(',');
        let bookUrls = [];
        reptileTypeArr.forEach((value, index) => {
            bookUrls.push(getBookUrl(value,bookName,isProxy))
        });

        Promise.all(bookUrls).then(async (result) => {
            let sendArr = [];
            let errorArr =[];
            result.forEach(async (urlList, index) => {
                if(typeof urlList === 'object' && urlList.length > 0) {
                    // console.log(urlList);
                    urlList.forEach(async (list, index2) => {
                        list.reptileType = reptileTypeArr[index];
                    });
                    sendArr = sendArr.concat(urlList);
                }else {
                    //爬取失败的提示
                    errorArr.push(urlList);
                }
            });
            sendArr = await callback(sendArr)
            // console.log('then:',result);    //数组形式
            res.send(tool.toJson({urlList:sendArr,errorArr}, '', 1000));
        }).catch(function(error){
            //只要有一个失败了
            res.send(tool.toJson(null, "获取链接失败，失败原因：" + error, 1002));
        })
    } catch(err) {
        res.send(tool.toJson(null, err, 1002));
    }
});


/*
* 处理urlList
* */
async function callback(urlList) {
    let i = 0, length = urlList.length;
    let titleObj = {
        // '斗破苍穹':1     //key值对应书名     value对应书的数量
    };
    for(i; i<length; i++) {
        let value = urlList[i];
        let count = null;
        if(titleObj[value.title] >= 0) {
            count = titleObj[value.title];
        } else {
            count = (await db.query(`select count(*) from book where name="${value.title}" and author="${value.author}"`))[0]["count(*)"];
        }
        if(count) {
            value.reptile = "已获取"
        } else {
            value.reptile = "点击获取小说"
        }
    }
    return urlList;
}

module.exports = router;