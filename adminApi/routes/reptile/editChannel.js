var express = require('express');
var router = express.Router();
const {oauth, tool, db, log, reptileConfig} = require("../../tool/require");

/*
*   修改渠道
*
* */
router.use('', oauth(4007), async function (req, res, next) {

    if (req.user.id != 1) {
        res.send(tool.toJson(null, '只有管理员id为1的可以操作', 1002));
        return;
    }

    let config = JSON.parse(tool.getParams(req, 'config', true));
    if (isNaN(parseInt(config.reptileTypeId))) {
        res.send(tool.toJson(null, 'reptileTypeId参数不规范', 1002));
        return;
    }
    if (!config.code || !config.name || !config.baseUrl) {
        res.send(tool.toJson(null, '网站编码、备注名称、来源地址，是必填的', 1002));
        return;
    }

    let hasReptileTool = await db.query(`select isSearch from reptiletool2 where reptileTypeId = ${config.reptileTypeId}`);
    if (hasReptileTool.length <= 0) {
        res.send(tool.toJson(null, '没有该来源渠道配置', 1002));
        return;
    }
    // 1代表启用  2表示禁用
    let isSearch = hasReptileTool[0].isSearch;
    if (isSearch == 1) {
        res.send(tool.toJson(null, '正在启用中的来源配置是不可更改的', 1002));
        return;
    }

    let setSqlObj = {
        code: config.code,
        name: config.name,
        baseUrl: config.baseUrl,
        codeTransform: config.codeTransform,
        searchUrl: config.searchUrl,
        searchList: config.searchList,
        searchListStart: config.searchListStart,
        searchListEnd: config.searchListEnd,
        searchListTitle: config.searchListTitle,
        searchListUrl: config.searchListUrl,
        searchListAuthor: config.searchListAuthor,
        searchListStatus: config.searchListStatus,
        searchListLastTime: config.searchListLastTime,
        bookTitle: config.bookTitle,
        bookAuthor: config.bookAuthor,
        updateTime: config.updateTime,
        bookType: config.bookType,

        isPage: config.isPage,                              // 是否是分页
        nextPage: config.nextPage,                          // 下一页目录
        nowPage: config.nowPage,                            // 当前目录页数
        allPage: config.allPage,                            // 总目录页数
        originUrlBefore: config.originUrlBefore,            // 来源地址前缀
        userAgent: config.userAgent,                        // 请求头的前缀

        catalogList: config.catalogList,
        firstCatalogList: config.firstCatalogList,
        endCatalogList: config.endCatalogList,
        bookImgUrl: config.bookImgUrl,
        bookDescription: config.bookDescription,
        catalogContent: config.catalogContent,
        catalogListUrl: config.catalogListUrl,
        catalogTitle: config.catalogTitle,
        catalogUrl: config.catalogUrl
    }
    let setSqlArr = Object.keys(setSqlObj).map((key, index) => {
        return `${key}="${setSqlObj[key] ? setSqlObj[key].replace(/"/g, `'`) : setSqlObj[key]}"`;
    });

    try {
        await db.query(`update reptiletool2 set ${setSqlArr.join(",")} where reptileTypeId = ${config.reptileTypeId}`)
        await reptileConfig.refreshReptileList();
        res.send(tool.toJson({successMsg: '修改渠道成功'}, null, 1000));
    } catch (err) {
        log.error(`update reptiletool2 set ${setSqlArr.join(",")} where reptileTypeId = ${config.reptileTypeId}`);
        log.error(err);
        res.send(tool.toJson(null, '修改渠道失败，失败原因：' + err, 1002));
    }
});

module.exports = router;
