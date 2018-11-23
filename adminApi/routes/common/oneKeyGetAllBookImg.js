var express = require('express');
var router = express.Router();
const { oauth, tool, db, log, fs, path } = require("../../tool/require");
const getImg = require("../../reptileTool/getImg.js");
let reptileCommon = require("../../reptileTool/common/reptileCommon");

let lastTime = 0;
router.use('', oauth(),  async function(req, res, next) {
    let startTime = new Date().getTime();
    if(startTime - lastTime <= 1000*60*60 * 1){  //距离上次爬取超过1个小时
        res.send(tool.toJson(null, '爬取全部书本图片功能，1个小时只能爬取一次', 1002));
        return;
    }
    lastTime = startTime;

    let bookList = await db.query('select * from book where type=3');

    bookList.forEach(async (book, index) => {
        let exists = fs.existsSync(path.join(__dirname, `../../books/${book.id}/logo.png`));
        if(!exists){
            let imgUrl = '';
            if (book.imgUrl.indexOf("http") === 0) {
                imgUrl = book.imgUrl;
            } else {
                imgUrl = reptileCommon[book.reptileType].baseUrl + book.imgUrl;
            }
            await getImg(book.id, imgUrl);
        }
    })
    res.send(tool.toJson('', '', 1000));
});

module.exports = router;
