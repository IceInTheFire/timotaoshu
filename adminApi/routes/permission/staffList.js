var express = require('express');
var router = express.Router();
const { oauth, tool,db } = require("../../tool/require");

router.use('', oauth(6101),  async function(req, res, next) {
    let page = tool.getParams(req, 'page') || 1;
    let limit = tool.getParams(req, 'limit') || 10;

    let userList = await db.query(`select users.id, users.roleId, users.name, users.mobile, role.roleName from users INNER JOIN role on users.roleId = role.id limit ${(page-1) * limit},${limit}`);
    let count = (await db.query(`select count(*) from users`))[0]["count(*)"];
    let userData = {
        count: count,
        userList: userList
    }
    res.send(tool.toJson(userData, '', 1000));
});

module.exports = router;
