var express = require('express');
var router = express.Router();
const { tool, db, log } = require("../../tool/require");
var common = require('../../tool/common');

/*
*   page 页数
*   limit 一页几条
*
* */
router.use('', async function(req, res, next) {
    tool.allowVisit(res); //为了跨域
    let type = req.query.type || req.body.type;
    let bookIds = req.query.bookIds || req.body.bookIds;
    let bookNames = req.query.bookNames || req.body.bookNames;

    if(!type) {
        res.send(tool.toJson(null, 'type不可为空', 1002));
        return;
    }
    if(type == "1" && !bookIds) {
        res.send(tool.toJson(null, '当type为1时，bookIds不能为空', 1002));
        return;
    }
    if(type == "2" && !bookNames) {
        res.send(tool.toJson(null, '当type为2时，bookNames不能为空', 1002));
        return;
    }
    if(type == "1" && tool.arrIsRepeat(bookIds.split(','))) {
        res.send(tool.toJson(null, '当type为1时，bookIds里有重复的值', 1002));
        return;
    }
    if(type == "2" && tool.arrIsRepeat(bookNames.split(','))) {
        res.send(tool.toJson(null, '当type为2时，bookNames里有重复的值', 1002));
        return;
    }

    let result = await common.listBatch(type, bookIds, bookNames);

    if(typeof result == "object" && result.error) {
        res.send(tool.toJson(null, result.error, 1002));
        return;
    } else if (typeof result == "object") {
        res.send(tool.toJson(result, '', 1000));
        return;
    } else{
        res.send(tool.toJson(null, "未知错误", 1002));
        return;
    }


});

module.exports = router;
