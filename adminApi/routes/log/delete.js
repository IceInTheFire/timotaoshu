var express = require('express');
var router = express.Router();
const { oauth, tool, path, fs, log } = require("../../tool/require");
const { logService } = require("../../service/");

router.use('', oauth(3002),  async function(req, res, next) {

    let logType = parseInt(tool.getParams(req, 'logType'));
    let nameArr = tool.getParams(req, 'nameArr');

    if(nameArr.indexOf('../') != -1) {
        res.send(tool.toJson(null, 'nameArr参数不对', 1002));
        return;
    }

    logService.dele(logType, nameArr).then((data) => {
        res.send(tool.toJson(data, null, 1000));
    }).catch((err) => {
        res.send(tool.toJson(null, err, 1002));
    });
});

module.exports = router;
