var express = require('express');
var router = express.Router();
const {oauth, tool, db, log, fs, path} = require("../../tool/require");
const { logService } = require("../../service/");

/*
*   page 页数
*   limit 一页几条
*
* */
router.use('', oauth(3003), async function (req, res, next) {

    let logType = parseInt(tool.getParams(req, 'logType')) || 1;
    let page = parseInt(tool.getParams(req, 'page')) || 1;
    let limit = parseInt(tool.getParams(req, 'limit')) || 20;


    logService.list(logType,page,limit).then((logList) => {
        res.send(tool.toJson(logList, null, 1000));
    }).catch((err) => {
        res.send(tool.toJson(null, err, 1002));
    });
});

module.exports = router;
