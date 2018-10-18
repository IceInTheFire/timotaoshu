let fs, rp, request, cheerio, iconv, morgan, path, db, tool, oauth, log, async,xlsx;
// ,wss;

if(global.timotaoApi){
    fs = global.timotaoApi.fs;
    rp = global.timotaoApi.rp;
    request = global.timotaoApi.request;
    cheerio = global.timotaoApi.cheerio;
    iconv = global.timotaoApi.iconv;
    morgan = global.timotaoApi.morgan;
    path = global.timotaoApi.path;
    db = global.timotaoApi.db;
    tool = global.timotaoApi.tool;
    oauth = global.timotaoApi.oauth;
    log = global.timotaoApi.log;
    async = global.timotaoApi.async;
    xlsx = global.timotaoApi.xlsx;
    // wss = global.timotaoApi.wss;
} else {
    fs = require("fs");
    rp = require("request-promise");
    request = require("request");
    cheerio = require("cheerio");
    iconv = require("iconv-lite");
    morgan = require("morgan");
    path = require("path");
    db = require('./mysql.js');
    tool = require('./tool.js');
    oauth = require('./oauth.js');
    log = require('tracer').colorConsole();
    // async = require('../../node_modules/async');
    async = require("async");
    xlsx = require('node-xlsx');
    // wss = require('./wss.js');
    global.timotao = {
        fs,
        rp,
        request,
        cheerio,
        iconv,
        morgan,
        path,
        db,
        tool,
        oauth,
        log,
        async,
        xlsx
        // wss
    }
}






module.exports = {
    fs,
    rp,
    request,
    cheerio,
    iconv,
    morgan,
    path,
    db,
    tool,
    oauth,
    log,
    async,
    xlsx
    // wss
};