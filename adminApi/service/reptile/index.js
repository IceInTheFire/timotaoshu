const startReptile = require("./startReptile.js");     //开始爬取
const restartCatalog = require("./restartCatalog.js");     //错误列表爬取
const oneKeyRestartCatalog = require("./oneKeyRestartCatalog.js");     //错误列表爬取
const oneKeyUpdateNewCatalog = require("./oneKeyUpdateNewCatalog.js");     //错误列表爬取


module.exports = {
    startReptile,
    oneKeyRestartCatalog,
    restartCatalog,
    oneKeyUpdateNewCatalog
};