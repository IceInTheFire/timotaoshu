let fs = require("fs");
let rp = require("request-promise");
let request = require("request");
let timoRp = require("./timoRp.js");
let cheerio = require("cheerio");
let iconv = require("iconv-lite");
let morgan = require("morgan");
let path = require("path");
let db = require("./mysql.js");
let tool = require("./tool.js");
let oauth = require("./oauth.js");
let log = require('tracer').colorConsole();
let async = require("async");
let xlsx = require('node-xlsx');

module.exports = {
    fs,
    rp,
    request,
    timoRp,
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