var express = require('express');
var router = express.Router();
const { oauth, tool, db, log, xlsx , fs, path} = require("../../tool/require");
const multer = require('multer');

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {

        let result = await oauth(2006)(req);
        if(result == true) {        //有权限
            // 接收到文件后输出的保存路径（若不存在则需要创建）
            // cb(null, 'upload/');
            cb(null, path.join(__dirname, '../../upload/'));
        } else {
            // return cb( new Error(result.msg), false);
            return cb(result, false);
        }

    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
        cb(null, Date.now() + "-" + Math.ceil(Math.random()*1000000)  + "-" + file.originalname);
    }
});

const upload = multer({storage: storage});

let mimeTypeArr = ['application/vnd.ms-excel', 'application/octet-stream'];

/*
*
* 这里的权限跟ip/index的权限一致
* */
router.use('',upload.single('file'), oauth(2006),  async function(req, res, next) {
    if (req.file) {
        if(mimeTypeArr.indexOf(req.file.mimetype) == -1) {
            res.send(tool.toJson(null, '上传文件格式错误', 1002));
            return;
        }
        var ipList = xlsx.parse(req.file.path)[0].data;
        let head = ipList[0];
        if(head[0] != 'index' || head[1] != 'IP' || head[2] != '地址' || head[3] != '类型' || head[4] != '来自备注' || head[5] != '来自地址' || head[6] != '响应时间'){
            res.send(tool.toJson(null, '文件格式不规范', 1002));
            return;
        }

        try{
            let list = [];
            let i = 1, length = ipList.length;
            for(i; i<length; i++){
                let value = ipList[i];
                let protocol = value[1].split('://')[0];
                let ip = value[1].split('://')[1].split(':')[0];
                let port = value[1].split('://')[1].split(':')[1];
                list.push({
                    address:value[2],
                    from:value[4],
                    fromHref:value[5],
                    ip:ip,
                    port:port,
                    protocol:protocol,
                    responseTime:value[6],
                    status:value[3]
                })
            }

            await tool.redisData.ipList.setIpList(list);
            res.send(tool.toJson(null, '导入成功', 1000));
        } catch(err) {
            res.send(tool.toJson(null, '文件不规范', 1002));
        }
    }
});

module.exports = router;
