var express = require('express');
var router = express.Router();
const { oauth, tool } = require("../../tool/require");

router.use('', oauth(6201),  async function(req, res, next) {
    // let user = await db.query('select * from users');

    let permission = tool.permissionList;

    res.send(tool.toJson(permission, '', 1000));
});

module.exports = router;
