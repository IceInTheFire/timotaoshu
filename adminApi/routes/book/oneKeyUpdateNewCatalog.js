var express = require('express');
var router = express.Router();
const { oauth, tool, db, log, fs, path } = require("../../tool/require");
const updateNewCatalog = require("../../reptileTool/updateNewCatalog");


router.use('', oauth(1201),  async function(req, res, next) {

    if(global.isUpdateReptile) {
        res.send(tool.toJson(null, '正在一键爬取中', 1002));
        return
    }

    let bookList = await db.query(`select * from book where bookStatus=1`);

    let arr = [];
    let i = 0, length = bookList.length;
    global.isUpdateReptile = true;
    for(i; i<length; i++) {
        let sqlbook = bookList[i];
        // log.info("哈哈哈");
        arr.push(await updateNewCatalog(sqlbook));
        log.info(`共${length}条，现第${i}条`);
        // log.info(arr);
    }

    global.isUpdateReptile = false;
    // log.info("一切都该结束了")
    res.send(tool.toJson(arr, null, 1000));
});

module.exports = router;
