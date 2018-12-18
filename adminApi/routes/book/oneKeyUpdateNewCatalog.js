var express = require('express');
var router = express.Router();
const { oauth, tool} = require("../../tool/require");
const { reptileService } = require("../../service");


router.use('', oauth(1201),  async function(req, res, next) {
    reptileService.oneKeyUpdateNewCatalog().then((msg)=>{
        res.send(tool.toJson(msg, null, 1000));
    }).catch((err) => {
        res.send(tool.toJson(null, err, 1002));
    });
});

module.exports = router;
