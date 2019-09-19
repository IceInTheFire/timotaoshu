var express = require('express');
var router = express.Router();
const {oauth, tool, db, log, reptileConfig} = require("../../tool/require");

/*
*   添加渠道
*
* */
router.use('', oauth(4006), async function (req, res, next) {
    let config = JSON.parse(tool.getParams(req, 'config', true));

    if (!config.code || !config.name || !config.baseUrl) {
        res.send(tool.toJson(null, '网站编码、备注名称、来源地址，是必填的', 1002));
        return;
    }

    let insertSql = `code, name, baseUrl, codeTransform, searchUrl, searchList, searchListStart, searchListEnd, searchListTitle, searchListUrl, searchListAuthor, searchListStatus, searchListLastTime, bookTitle, bookAuthor, updateTime, bookType, isPage, nextPage, nowPage, allPage, originUrlBefore, userAgent, catalogList, firstCatalogList, endCatalogList, bookImgUrl, bookDescription, catalogContent,catalogListUrl,catalogTitle,catalogUrl`;

    let { code, name, baseUrl, codeTransform, searchUrl, searchList, searchListStart, searchListEnd, searchListTitle, searchListUrl, searchListAuthor, searchListStatus, searchListLastTime, bookTitle, bookAuthor, updateTime, bookType, isPage, nextPage, nowPage, allPage, originUrlBefore, userAgent, catalogList, firstCatalogList, endCatalogList, bookImgUrl, bookDescription, catalogContent,catalogListUrl,catalogTitle,catalogUrl } = config;

    let insertSqlArr = [
        code, name, baseUrl, codeTransform, searchUrl, searchList, searchListStart, searchListEnd, searchListTitle, searchListUrl, searchListAuthor, searchListStatus, searchListLastTime, bookTitle, bookAuthor, updateTime, bookType, isPage, nextPage, nowPage, allPage, originUrlBefore, userAgent, catalogList, firstCatalogList, endCatalogList, bookImgUrl, bookDescription, catalogContent,catalogListUrl,catalogTitle,catalogUrl
    ];
    insertSqlArr.forEach((value, index) => {
        insertSqlArr[index] = `"${value?(value+'').replace(/"/g,`'`):value}"`;
    })

    // console.log(`insert into reptiletool2 (${insertSql})Values(${insertSqlArr.join(',')})`);
    try{
        await db.query(
            `insert into reptiletool2 (${insertSql})Values(${insertSqlArr.join(',')})`
        );
        res.send(tool.toJson({successMsg:'新增渠道成功'}, null, 1000));
    }catch(err) {
        log.error(`insert into reptiletool2 (${insertSql})Values(${insertSqlArr.join(',')})`);
        log.error(err);
        res.send(tool.toJson(null, '新增渠道失败，失败原因：'+err, 1002));
    }
});

module.exports = router;
