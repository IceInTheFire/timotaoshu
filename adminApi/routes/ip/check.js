var express = require('express');
var router = express.Router();
const { oauth, tool, db, log } = require("../../tool/require");
const { ipReptileService } = require("../../service/");


router.use('', oauth(2002),  async function(req, res, next) {
    ipReptileService.check().then((msg) => {
        res.send(tool.toJson(msg, null, 1000));
    }).catch((err) => {
        res.send(tool.toJson(null, err, 1002));
    });
});

module.exports = router;
