var express = require('express');
var router = express.Router();
const { oauth, tool, db, log, xlsx } = require("../../tool/require");
// var xlsx = require('node-xlsx');

/*
*
* 这里的权限跟ip/index的权限一致
* */
router.use('', oauth(2007),  async function(req, res, next) {
    let count = await tool.redisData.ipList.getIpCount();
    let ipList2 = await tool.redisData.ipList.getIpList(0,count);

    let ipList = [];
    ipList2.forEach((value, index) => {
        let value2 = JSON.parse(value);         // 先变成obj
        value2.index = index;  // index是redis集合里的索引值
        ipList.push(value2);
    });

    const data = [
        ['index', 'IP', '地址','类型','来自备注','来自地址','响应时间'],
        // [0, 'http://106.75.225.83:808', '山东济南', '高匿','西刺代理','http://www.xicidaili.com/wt/','6.883秒'],
    ];
    ipList.forEach((value, index) =>{
       data.push([
           value.index,
           value.protocol + '://' + value.ip + ':' + value.port,
           value.address,
           value.status,
           value.from,
           value.fromHref,
           value.responseTime
       ])
    });

    let xlsBuffer = xlsx.build([{name: '代理IP列表', data: data}]);

    res.writeHead('200', {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=ip.xls`
    });

    // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    // res.setHeader('Content-Disposition', `attachment; filename=test.xlsx`);
    // res.writeHead(200);

    // res.end(xls,'binary');
    res.end(xlsBuffer,'binary');
});

module.exports = router;
