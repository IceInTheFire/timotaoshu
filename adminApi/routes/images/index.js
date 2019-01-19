var express = require('express');
var router = express.Router();
const { fs, path, tool, db } = require("../../tool/require");


router.use('/:bookName', async function(req, res, next) {
    // let bookName = req.query.bookName || req.body.bookName;

    let bookName = req.params.bookName;
    // let exists = fs.existsSync(path.join(__dirname, '../../../books/' + bookName + "/logo.png"));
    let exists = fs.existsSync(path.join(__dirname, '../../../books/' + bookName + ".png"));
    if(!exists) {
        res.send(tool.toJson(null, '图片不存在', 1002));
        return;
    }
    // let image = fs.readFileSync(path.join(__dirname, '../../../books/' + bookName + "/logo.png"));
    let image = fs.readFileSync(path.join(__dirname, '../../../books/' + bookName + ".png"));

    res.writeHead('200', {'Content-Type': 'image/jpeg'});    //写http头部信息
    // res.writeHead('200', {'Content-Type': 'application/force-download'});    //写http头部信息  下载弹出保存
    // res.writeHead('200', {'Content-Type': 'application/octet-stream'});    //写http头部信息
    // res.writeHead('200', {'Content-Type': 'application/download'});    //写http头部信息
    // res.writeHead('200', {'Content-Disposition': 'attachment;filename=测试.jpg'});    //写http头部信息
    // res.writeHead('200', {
    // 'Content-Type': 'image/jpeg',
    // 'Content-Disposition':'attachment; filename=11.png',
    // 'Content-Transfer-Encoding':'binary',
    // 'Connection':'close'
    // });    //写http头部信息
    // header('Content-Disposition:attachment;filename=' . basename($filename));
    // header('Content-Length:' . filesize($filename));

    // res.end(image,'binary');     //res结束，把图片显示出来也可以res.write(img,'binary')
    res.end(image,'binary');     //res结束，把图片显示出来也可以res.write(img,'binary')
});

module.exports = router;
