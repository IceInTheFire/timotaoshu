var express = require('express');
var router = express.Router();
const { oauth, tool, db, log, xlsx , fs, path, reptileConfig} = require("../../tool/require");
const multer = require('multer');

let mimeTypeArr = ['application/vnd.ms-excel', 'application/octet-stream'];

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {

        let result = await oauth(4010)(req);
        if(result && req.user.id == 1) {        //有权限
            // 接收到文件后输出的保存路径（若不存在则需要创建）
            // cb(null, 'upload/');
            cb(null, path.join(__dirname, '../../upload/'));
        } else {
            // return cb( new Error(result.msg), false);
            if(result){
                return cb(result, false);
            }else {
                return cb('只有管理员id为1的可以上传', false);
            }
        }

    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
        cb(null, Date.now() + "-" + Math.ceil(Math.random()*1000000)  + "-" + file.originalname);
    }
});

const upload = multer({storage: storage});

router.use('',upload.single('file'), oauth(4010),  async function(req, res, next) {
    if (req.file) {
        if(mimeTypeArr.indexOf(req.file.mimetype) == -1) {
            res.send(tool.toJson(null, '上传文件格式错误', 1002));
            return;
        }
        let reptileList = xlsx.parse(req.file.path)[0].data;
        let head = reptileList[0];
        if(head[0] != '配置Id' ||
            head[1] != '网站编码' ||
            head[2] != '来源网址' ||
            head[3] != '备注名称' ||
            head[4] != '启用状态' ||
            head[5] != '转码格式' ||
            head[6] != '搜索地址' ||
            head[7] != '搜索列表' ||
            head[8] != 'start索引' ||
            head[9] != 'end索引' ||
            head[10] != '小说名称' ||
            head[11] != '小说地址' ||
            head[12] != '小说作者' ||
            head[13] != '小说状态' ||
            head[14] != '列表最后更新时间' ||
            head[15] != '小说名称' ||
            head[16] != '小说作者' ||
            head[17] != '章节最后更新时间' ||
            head[18] != '小说分类' ||
            head[19] != '小说封面' ||
            head[20] != '小说描述' ||
            head[21] != '章节目录地址' ||
            head[22] != '章节目录' ||
            head[23] != 'start索引' ||
            head[24] != 'end索引' ||
            head[25] != '章节名称' ||
            head[26] != '章节Url地址' ||
            head[27] != '小说详情' ||
            head[28] != '启用禁用原因'
        ){
            res.send(tool.toJson(null, '文件格式不规范', 1002));
            return;
        }

        try{
            let i = 1, length = reptileList.length;
            for(i; i<length; i++){
                let value = reptileList[i];
                let insertSql = `code, name, baseUrl, codeTransform, searchUrl, searchList, searchListStart, searchListEnd, searchListTitle, searchListUrl, searchListAuthor, searchListStatus, searchListLastTime, bookTitle, bookAuthor, updateTime, bookType, catalogList, firstCatalogList, endCatalogList, bookImgUrl, bookDescription, catalogContent,catalogListUrl,catalogTitle,catalogUrl`;

                let insertSqlArr = [
                    value[1], value[3], value[2], value[5], value[6], value[7], value[8], value[9], value[10], value[11], value[12], value[13], value[14], value[15], value[16], value[17], value[18], value[22], value[23], value[24], value[19], value[20], value[27],value[21],value[25], value[26]
                ];
                insertSqlArr.forEach((value, index) => {
                    insertSqlArr[index] = `"${value?value.replace(/"/g,`'`):value}"`;
                });
                // console.log(`insert into reptiletool2 (${insertSql})Values(${insertSqlArr.join(',')})`);
                try {
                    await db.query(
                        `insert into reptiletool2 (${insertSql})Values(${insertSqlArr.join(',')})`
                    );
                } catch (e) {
                    log.error(e);
                }

            }
            await reptileConfig.refreshReptileList();
            res.send(tool.toJson(null, '导入成功', 1000));
        } catch(err) {
            res.send(tool.toJson(null, '文件不规范', 1002));
        }
    }
});

module.exports = router;
