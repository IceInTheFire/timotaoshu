var express = require('express');
var router = express.Router();
const { oauth, tool } = require("../../tool/require");

router.use('', oauth(),  async function(req, res, next) {
    // let user = await db.query('select * from users');

    res.send(tool.toJson(req.user, '', 1000));
});

module.exports = router;
