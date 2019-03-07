var express = require('express');
var router = express.Router();
const {oauth, tool, db, log, fs, path} = require("../../tool/require");
const {reptileService} = require("../../service/");
/*
* 再次爬取
* 也就是爬取错误列表
* */
router.use('', oauth(4007), async function (req, res, next) {
    let errorId = parseInt(tool.getParams(req, 'errorId'));
    let tiType = tool.getParams(req, 'tiType') == 1 ? true:false;       //当tiType为1时，是替代
    reptileService.restartCatalog(errorId,tiType).then((msg) => {
        res.send(tool.toJson(msg, null, 1000));
    }).catch((err) => {
        res.send(tool.toJson(null, err, 1002));
    });
});

module.exports = router;
