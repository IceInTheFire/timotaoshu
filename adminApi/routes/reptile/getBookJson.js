var express = require('express');
var router = express.Router();
const { oauth, tool, log} = require("../../tool/require");
const getBookCatalogJson = require("../../reptileTool/getBookCatalogJson");

/*
*   获取书的json，并存储
* */
router.use('', oauth(4001),  async function(req, res, next) {
    let bookUrl = tool.getParams(req, 'bookUrl');
    let bookName = tool.getParams(req, 'bookName');
    let author = tool.getParams(req, 'author');
    let reptileType = tool.getParams(req, 'reptileType') || 0;
    // if(reptileType < 0) {
    //     res.send(tool.toJson("没有reptileType参数或reptileType参数错误", null, 1002));
    //     return;
    // }
    if(!bookUrl) {
        res.send(tool.toJson("没有bookUrl参数", null, 1002));
        return;
    }
    if(!bookName) {
        res.send(tool.toJson("没有bookName参数", null, 1002));
        return;
    }
    if(!author) {
        res.send(tool.toJson("没有author参数", null, 1002));
        return;
    }

    try{
        await getBookCatalogJson(reptileType, bookUrl, function(urlList) {
            res.send(tool.toJson(urlList, null, 1000));
        }, function(error) {
            log.error("失败原因：" + error);
            if(error == "本书已存在"){
                res.send(tool.toJson(null, '本书已存在', 1002));
            }else {
                res.send(tool.toJson(null, '失败原因：' + error, 1002));
            }
        });
    } catch(err) {
        res.send(tool.toJson(null, "" + err, 1002));
    }
});

module.exports = router;