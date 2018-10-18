const common = require("../../common/tool/require");

let wss;
if(global.timotaoApi) {
    wss = global.timotaoApi.wss;
} else {
    wss = require("./wss");
    global.timotaoApi = {
        wss:wss
    };
}

common.wss = wss;

module.exports = common;