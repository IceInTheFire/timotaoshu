const multer = require('multer');
module.exports = async function(tool, path, fs, app) {
    /*
    * 文件上传中间件start
    * */
    /*
    * 创建文件夹
    * */
    tool.hasDir(fs, path.join(__dirname, '../upload/'));
    tool.hasDir(fs, path.join(__dirname, '../public'));
    tool.hasDir(fs, path.join(__dirname, '../public/img'));
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            // 接收到文件后输出的保存路径（若不存在则需要创建）
            // cb(null, 'upload/');
            cb(null, path.join(__dirname, '../upload/'));
        },
        filename: function (req, file, cb) {
            // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
            cb(null, Date.now() + "-" + file.originalname);
        }
    });
    /*
    * 图片上传规则
    * */
    const storage2 = multer.diskStorage({
        destination: function (req, file, cb) {
            // 接收到文件后输出的保存路径（若不存在则需要创建）
            // cb(null, 'upload/');
            cb(null, path.join(__dirname, '../public/img'));
        },
        filename: function (req, file, cb) {
            var fileformat = file.originalname.split('.');
            const houzhui =  fileformat[fileformat.length-1] || 'png';
            cb(null, Date.now() + "." + houzhui);
        }
    });


    // 创建 multer 对象
    const upload = multer({storage: storage});
    app.all("/ip/uploadIp", upload.single('file'));     //上传ip xls文件
    const upload2 = multer({storage: storage2});
    app.all("/upload", upload2.single('file'));     //上传图片
    /*
    * 文件上传中间件end
    * */
}