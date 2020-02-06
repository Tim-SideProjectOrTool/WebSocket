const http = require('http');
const url = require('url');
const fs = require('fs');
var WebSocket = require('ws');
// var fun = function (request, response) {
//     //var stream=fs.createReadStream('../views/ws.html',{flag:'r',encoding:'utf8'});
//     var stream = fs.createReadStream('ws.html', { flag: 'r', encoding: 'utf8' });
//     stream.pipe(response);
// }
// var server = http.createServer(fun).listen(8000);
var server = http.createServer().listen(8000);
var wss = new WebSocket.Server({ server: server });

// wss.broadcast = function broadcast() {
//     wss.clients.forEach(function each(client) {
//         // if (client.readyState == WebSocket.OPEN) {
//         //     client.send("開始！");
//         //     console.log(client.id);
//         // }
//     })
// }

//連線時產生一組ID給Client
function getUniqueID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
};

//Client與Server連線
wss.on('connection', function connection(ws, req) {
    var ID = getUniqueID();
    ws.id = ID;

    //#region 一開始連線,回發訊息給當前連線的人
    console.log("連線囉connection,賦予ID =" + ID);
    /*wss.clients為所有連線人員,在個別列出來*/
    wss.clients.forEach(function each(client) {
        if (client.id == ID) {
            client.send("開通囉!!");
        }
    })
    //#endregion

    //Server收到Client發送過來的訊息
    ws.on('message', function incoming(message) {
        var smg = JSON.parse(message);
        console.log("Server收到的訊息 --> 發信人:" + smg.name + " ,訊息內容 : " + smg.msg);

        //同步所有Client端訊息
        wss.clients.forEach(function each(client) {
            // //發一般的訊息
            client.send(smg.name + " 說了 : " + smg.msg);
        })
    });

    ws.on('close', function incoming(client) {
        console.log("連線關閉囉!!! 使用者ID : "+this.id);
    });

    // wss.broadcast();
})



//#region 查詢目前連線人員
// setTimeout( showClient, 100);
function showClient() {
    console.log("== 目前連線成員 ==");
    //同步所有Client端訊息
    wss.clients.forEach(function each(client) {
        console.log("ID --> " + client.id);
    })
    console.log("=================");
};
//#endregion
