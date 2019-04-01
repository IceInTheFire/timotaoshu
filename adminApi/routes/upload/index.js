var express = require('express');
var router = express.Router();
const { oauth, tool, path, fs} = require("../../tool/require");
const multer = require("multer");

let storage = multer.diskStorage({
    destination: async function(req, file, cb) {
        let result = await oauth(7001)(req);
        if(result == true) {        //有权限

            let type = tool.getParams(req, 'type');     //如果为1  表示小说封面上传
            // let bookId = tool.getParams(req, 'bookId');

            if(type == 1) {//如果为1  表示小说封面上传
                cb(null, path.join(__dirname, '../../../books/'));
            } else {    //公共上传
                cb(null, path.join(__dirname, '../../public/img'));
            }
        } else {
            return cb( new Error(result.msg), false);
        }
    },
    filename: function(req, file, cb) {
        let type = tool.getParams(req, 'type');     //如果为1  表示小说封面上传
        let bookId = tool.getParams(req, 'bookId');

        var fileformat = file.originalname.split('.');
        const houzhui =  fileformat[fileformat.length-1] || 'png';
        if(type == 1) {//如果为1  表示小说封面上传
            cb(null, bookId + ".png");
        } else {//公共上传
            cb(null, Date.now() + "-" + Math.ceil(Math.random()*1000000) + "." + houzhui);
        }
    }
})
let upload = multer({ storage: storage });


router.use('', upload.single('file'), oauth(7001),  async function(req, res, next) {
    if (req.file) {
        res.send(tool.toJson({
            imgUrl:req.file.filename,
        },'图片上传成功', 1000));
    } else {
        res.send(tool.toJson(null, "图片上传失败", 1002));
    }
});

module.exports = router;
