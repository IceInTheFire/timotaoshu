var express = require('express');
var router = express.Router();
const { oauth, tool, db, log, xlsx, reptileConfig } = require("../../tool/require");
// var xlsx = require('node-xlsx');

/*
*
*
* */
router.use('', oauth(4011),  async function(req, res, next) {
    let reptileList = await reptileConfig.getReptileList();
    let count = reptileList.length;

    const data = [
        [
            '配置Id',
            '网站编码',
            '来源网址',
            '备注名称',
            '启用状态',
            '转码格式',
            '搜索地址',
            '搜索列表',
            'start索引',
            'end索引',
            '小说名称',
            '小说地址',
            '小说作者',
            '小说状态',
            '列表最后更新时间',
            '小说名称',
            '小说作者',
            '章节最后更新时间',
            '小说分类',
            '小说封面',
            '小说描述',
            '章节目录地址',
            '章节目录',
            'start索引',
            'end索引',
            '章节名称',
            '章节Url地址',
            '小说详情',
            '启用禁用原因',
        ],
    ];
    reptileList.forEach((value, index) =>{
        let item = JSON.parse(value);
        data.push([
            item.reptileTypeId,
            item.code,
            item.baseUrl,
            item.name,
            item.isSearch == 1 ? '启用' : '禁用',
            item.codeTransform,
            item.searchUrl,
            item.searchList,
            item.searchListStart,
            item.searchListEnd,
            item.searchListTitle,
            item.searchListUrl,
            item.searchListAuthor,
            item.searchListStatus,
            item.searchListLastTime,
            item.bookTitle,
            item.bookAuthor,
            item.updateTime,
            item.bookType,
            item.bookImgUrl,
            item.bookDescription,
            item.catalogListUrl,
            item.catalogList,
            item.firstCatalogList,
            item.endCatalogList,
            item.catalogTitle,
            item.catalogUrl,
            item.catalogContent,
            item.reason
        ]);
    });

    let xlsBuffer = xlsx.build([{name: '来源渠道列表', data: data}]);

    res.writeHead('200', {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=channel.xls`
    });

    // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // res.setHeader('Content-Disposition', `attachment; filename=test.xlsx`);
    // res.writeHead(200);

    // res.end(xls,'binary');
    res.end(xlsBuffer,'binary');
});

module.exports = router;
