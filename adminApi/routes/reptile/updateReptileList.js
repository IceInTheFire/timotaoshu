var express = require('express');
var router = express.Router();
const { log,db,oauth, tool,reptileConfig } = require("../../tool/require");

/*
*   page 页数
*   limit 一页几条
*
* */
router.use('', oauth(4005),  async function(req, res, next) {

    // let limit = tool.getParams(req, 'limit') || 20;
    // let page = tool.getParams(req, 'page') || 1;

    try{
        let reptileList = await reptileConfig.refreshReptileList();
        let count = reptileList.length;

        reptileList.forEach((value, index) => {
            reptileList[index] = JSON.parse(value);
        });
        let data = {
            reptileList,
            count
        };
        res.send(tool.toJson(data, '', 1000));
    } catch(err) {
        res.send(tool.toJson(null, JSON.stringify(err), 1002));
    }
});

module.exports = router;
