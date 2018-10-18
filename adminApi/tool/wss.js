const WebSocket = require('ws');
const wss = new WebSocket.Server({
    port: 8000,
    verifyClient: socketVerify, //可选，验证连接函数
    perMessageDeflate: {
        // zlibDeflateOptions: { // See zlib defaults.
        //     chunkSize: 1024,
        //     memLevel: 7,
        //     level: 3,
        // },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        clientMaxWindowBits: 10,       // Defaults to negotiated value.
        serverMaxWindowBits: 10,       // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10,          // Limits zlib concurrency for perf.
        threshold: 1024,               // Size (in bytes) below which messages
                                       // should not be compressed.
    }
});

let count = 0;  //目前正在连接服务器的数量
console.log("websocket服务器开启了,端口8000");

wss.on('connection', function (ws) {
    count++;
    wss.broadcastCount();
    // ws.on('message', function (message) {
    //     console.log('received: %s', message);
    // });
    // ws.send('我是从服务器里发送的消息');

    ws.on('close', function () {
        count--;
        wss.broadcastCount();
    });
    ws.on('error', function() {
        count--;
        wss.broadcastCount();
    });
});



// wss.broadcast = function (s,ws) {
//     wss.clients.forEach(function (client) {
//         if(s == 1){
//             client.send(ws.name + ":" + ws.msg);
//         }
//         if(s == 0){
//             client.send(ws.name + "退出聊天室");
//         }
//         // {name:'" + name + "',msg:'" + msg + "',key:'" + key + "'}
//     });
// };

//广播count
wss.broadcastCount = function () {
    wss.clients.forEach(function (client) {
        try{
            client.send(`[{"count":"${count}"}]`);
        }catch(err) {
            // console.log(err);
        }
    });
};

let infoList = [];

//广播
wss.broadcast = function (data) {

    infoList.push({progress:data});

    setInterval(function() {
        if(infoList.length > 0) {
            let str = JSON.stringify(infoList.splice(0, infoList.length));
            wss.clients.forEach(function (client) {
                try{
                    client.send(str);
                }catch(err) {
                    // console.log(err);
                }
            });
        }
    }, 5000);
};

/*
* 来源验证
* */
function socketVerify(info) {
    var token = GetRequest(info.req.url).token;
    if(!token) {
        //没有token 拒绝连接
        return false;
    }
    return true;
}


function GetRequest(urlParams) {
    var url = urlParams.indexOf('?') != -1 ? urlParams.split('?')[1] : ''; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") == -1) {
        var str = url;
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}


module.exports = wss;