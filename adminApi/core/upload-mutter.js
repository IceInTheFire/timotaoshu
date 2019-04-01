const multer = require('multer');
module.exports = async function(tool, path, fs, app) {
    /*
    * 创建文件夹
    * */
    tool.hasDir(fs, path.join(__dirname, '../upload/'));
    tool.hasDir(fs, path.join(__dirname, '../public'));
    tool.hasDir(fs, path.join(__dirname, '../public/img'));

}