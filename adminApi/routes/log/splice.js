var express = require('express');
var router = express.Router();
const { oauth, tool, path, fs, log } = require("../../tool/require");
const { logService } = require("../../service/");

router.use('', oauth(3004),  async function(req, res, next) {

    let logType = parseInt(tool.getParams(req, 'logType'));

    logService.splice(logType).then((data) => {
        res.send(tool.toJson(data, null, 1000));
    }).catch((error) => {
        res.send(tool.toJson(null, error, 1002));
    });
});

module.exports = router;
