var express = require('express');
var router = express.Router();
const { oauth, tool,db } = require("../../tool/require");

router.use('', oauth(6001),  async function(req, res, next) {
    let page = tool.getParams(req, 'page') || 1;
    let limit = tool.getParams(req, 'limit') || 10;

    let roleList = await db.query(`select * from role limit ${(page-1) * limit},${limit}` );
    let count = (await db.query(`select count(*) from role`))[0]["count(*)"];
    let roleData = {
        count: count,
        roleList: roleList
    }
    res.send(tool.toJson(roleData, '', 1000));
});

module.exports = router;
