var express = require('express');
var router = express.Router();
const { oauth, tool, log,db} = require("../../tool/require");
const getBookCatalogJson = require("../../reptileTool/getBookCatalogJson");

/*
*   获取书的json，并存储
* */
router.use('', oauth(4001),  async function(req, res, next) {
    let bookUrl = tool.getParams(req, 'bookUrl');
    let bookName = tool.getParams(req, 'bookName');
    let author = tool.getParams(req, 'author');
    let reptileTypeId = parseInt(tool.getParams(req, 'reptileType'));
    // if(reptileType < 0) {
    //     res.send(tool.toJson("没有reptileType参数或reptileType参数错误", null, 1002));
    //     return;
    // }
    if(!bookUrl) {
        res.send(tool.toJson(null, "没有bookUrl参数", 1002));
        return;
    }
    if(!bookName) {
        res.send(tool.toJson(null, "没有bookName参数", 1002));
        return;
    }
    if(!author) {
        res.send(tool.toJson(null, "没有author参数", 1002));
        return;
    }
    if(isNaN(reptileTypeId)) {
        res.send(tool.toJson(null, "没有reptileType参数", 1002));
        return;
    }

    let hasReptileTool = await db.query(`select isSearch from reptiletool2 where reptileTypeId = ${reptileTypeId}`);
    if(hasReptileTool.length <= 0) {
        res.send(tool.toJson(null, '没有该来源渠道配置', 1002));
        return;
    }
    // 1代表启用  2表示禁用
    let isSearch = hasReptileTool[0].isSearch;
    if(isSearch == 2) {
        res.send(tool.toJson(null, '该来源渠道正在禁用中', 1002));
        return;
    }

    try{
        await getBookCatalogJson(reptileTypeId, bookUrl, function(urlList) {
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