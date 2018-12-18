var express = require('express');
var router = express.Router();
const { oauth, tool, path, fs, log } = require("../../tool/require");
const { logService } = require("../../service/");

router.use('', oauth(3001),  async function(req, res, next) {

    let logType = parseInt(tool.getParams(req, 'logType'));
    let name = tool.getParams(req, 'name');
    if(!name) {
        res.status(202);
        res.send(tool.toJson(null, 'name不可为空', 1002));
        return;
    }
    let basePath = await logService.download(logType,name); //读取的地址


    let f = fs.createReadStream(basePath);
    try{
        res.writeHead(200, {
            'Content-Type': 'application/force-download',
            // 'Content-Type' : 'application/octet-stream',
            // 'Content-Disposition': 'attachment; filename=' + name
            'Content-Disposition': 'attachment; filename=log.log'
        });
        f.pipe(res);
    }catch(err) {
        log.error("err");
    }

});

module.exports = router;
