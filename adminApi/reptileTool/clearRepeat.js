
const {fs, path, tool, db} = require("../tool/require");

module.exports = clearRepeat;

//检查本地json数据是否重复或者空
function clearRepeat(callback) {
    let files = fs.readdirSync(path.join(__dirname, "../../book"));
    /*
    * 本地book文件夹重复判断
    * 逻辑，只要文件名是null.json或者带有  - 副本的文件名的，直接删除。
    * */
    let i = 0, length = files.length;
    for(i; i<length; i++) {
        if(files[i] == "null.json" || files[i].indexOf(" - 副本") != -1) {
            tool.deleteAll(fs, path.join(__dirname, "../../book/" + files[i]));
        }
    }
    if(callback){
        removeRepeat(callback);
    }
}


//数据库里判断json数据是否已爬取
let removeRepeat = async function (callback){
    /*
     * 本地book文件夹里的书与mysql里的数据判断重复
     * */
    let files = fs.readdirSync(path.join(__dirname, "../../book"));
    let i = 0, length = files.length;
    for(i; i<length; i++) {
        let bookName = files[i].split(".json")[0];
        if(bookName) {
            let sql = `select COUNT(*) from book where name ="${bookName}"`;
            let result = tool.getData(await db.query(sql));
            if(result) {  //如果数据库里有这本书
                tool.deleteAll(fs, path.join(__dirname, "../../book/" + files[i]));
            }
        }
    }
    if(callback)    callback();
}

// clearRepeat();
// removeRepeat();