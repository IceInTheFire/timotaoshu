var express = require('express');
var router = express.Router();
const { oauth, tool } = require("../../tool/require");

router.use('', oauth(7001),  async function(req, res, next) {
    // let user = await db.query('select * from users');
    if (req.file) {
        res.send(tool.toJson({
            imgUrl:req.file.filename,
        },'图片上传成功', 1000));
    } else {
        res.send(tool.toJson(null, "图片上传失败", 1002));
    }

});

module.exports = router;
