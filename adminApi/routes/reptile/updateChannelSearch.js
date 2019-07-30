var express = require('express');
var router = express.Router();
const {oauth, tool, db, log, reptileConfig} = require("../../tool/require");

/*
*   启用禁用
*
*   reptileTypeId
*   isSearch
*   search      可为空
* */
router.use('', oauth(4008), async function (req, res, next) {

    if(req.user.id != 1) {
        res.send(tool.toJson(null, '只有管理员id为1的可以操作', 1002));
        return;
    }

    let reptileTypeId = parseInt(tool.getParams(req, 'reptileTypeId'));
    let isSearch = parseInt(tool.getParams(req, 'isSearch'));
    let reason = tool.getParams(req, "reason") || '';     //原因

    if (isNaN(reptileTypeId)) {
        res.send(tool.toJson(null, 'reptileTypeId参数不规范', 1002));
        return
    }
    if (isNaN(isSearch) || (isSearch != 1 && isSearch != 2)) {
        res.send(tool.toJson(null, 'isSearch参数不规范', 1002));
        return
    }

    let successMsg = '';
    if (isSearch == 1) {
        successMsg = '启用';
    } else if (isSearch == 2) {
        successMsg = '禁用';
    }
    try {
        await db.query(`update reptiletool2 set isSearch=${isSearch}, reason="${reason}" where reptileTypeId=${reptileTypeId}`);
        await reptileConfig.refreshReptileList();
        res.send(tool.toJson({successMsg: successMsg + "成功"}, '', 1000));
    } catch (err) {
        res.send(tool.toJson(null, `${successMsg}失败，失败原因：${err}`, 1002));
    }
});

module.exports = router;
