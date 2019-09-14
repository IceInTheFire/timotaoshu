var express = require('express');
var router = express.Router();
const { oauth, tool, db, log,reptileConfig } = require("../../tool/require");

/*
*   删除渠道
*
* */
router.use('', oauth(4009),  async function(req, res, next) {
    if(req.user.id != 1) {
        res.send(tool.toJson(null, '只有管理员id为1的可以操作', 1002));
        return;
    }

    let reptileTypeId = JSON.parse(tool.getParams(req, 'reptileTypeId'));
    if(isNaN(parseInt(reptileTypeId))) {
        res.send(tool.toJson(null, 'reptileTypeId参数不规范', 1002));
        return;
    }
    let hasReptileTool = await db.query(`select isSearch from reptiletool2 where reptileTypeId = ${reptileTypeId}`);
    if(hasReptileTool.length <= 0) {
        res.send(tool.toJson(null, '没有该来源渠道配置', 1002));
        return;
    }
    // 1代表启用  2表示禁用
    let isSearch = hasReptileTool[0].isSearch;
    if(isSearch == 1) {
        res.send(tool.toJson(null, '正在启用中的来源配置是不可删除的', 1002));
        return;
    }
    let bookCount = (await db.query(`select count(id) from book where reptileType = ${reptileTypeId} and bookStatus = 1`))[0]['count(id)'];
    if(bookCount > 0) {
        res.send(tool.toJson(null, '该来源渠道有正在连载的小说，请先处理！', 1002));
        return;
    }

    try{
        await db.query(`delete from reptiletool2 where reptileTypeId = ${reptileTypeId}`);
        res.send(tool.toJson({successMsg:'删除渠道成功'}, null, 1000));
    }catch(err) {
        log.error(`delete from reptiletool2 where reptileTypeId = ${reptileTypeId}`);
        log.error(err);
        res.send(tool.toJson(null, '删除渠道失败，失败原因：'+err, 1002));
    }
});

module.exports = router;
