var express = require('express');
var router = express.Router();
const { oauth, tool, db, log } = require("../../tool/require");

/*
*   name 小说名称
*   bookType 小说类型
*   author 小说作者
*   description 小说描述
* */
router.use('', oauth(8002),  async function(req, res, next) {
    let name = tool.getParams(req, 'name');
    let bookType = tool.getParams(req, 'bookType');
    let author = tool.getParams(req, 'author');
    let description = tool.getParams(req, 'description');

    if(!name){
        res.send(tool.toJson(null, '小说名称不能为空', 1002));
        return;
    }
    if(!bookType){
        res.send(tool.toJson(null, '小说类型不能为空', 1002));
        return;
    }
    if(!author){
        res.send(tool.toJson(null, '小说作者不能为空', 1002));
        return;
    } else if(author != req.user.name){
        res.send(tool.toJson(null, '小说作者与账号不匹配', 1002));
        return;
    }
    if(!description){
        res.send(tool.toJson(null, '小说描述不能为空', 1002));
        return;
    }


    let book = {
        title: name,
        author: author,
        description: description,
        imgUrl: null,
        baseUrl: null,
        originUrl: null,
        // catalog:catalogArr,
        updateTime: new Date().Format(),
        bookType: bookType,
        /*
        * 小说状态
        * 默认1
        * 1：连载
        * 2：完本
        * 3：本站连载
        * 4：本站完结
        * */
        bookStatus: 3,
        reptileType: 0,
        /*
        * 类型
        * 1：爬了章节名，未爬内容 也未填充作者描述来源等  默认
        * 2：填充作者描述来源等。
        * 3：内容已经爬完
        *
        *
        * 4：来源本站
        * */
        type:4,
        /*
        * 1、启用
        * 2、禁用
        *
        * 默认1
        * */
        isJin:2,
    };
    // let sql = `INSERT INTO book(name, author, description, reptileType, originUrl, imgUrl, type,updateTime,bookType,bookStatus,isJin) VALUES ("${book.title}","${tool.toSql(book.author)}","${tool.toSql(book.description)}", ${book.reptileType},"${book.originUrl}","${book.imgUrl}", 2, date_sub("${book.updateTime}",interval 0 day), "${book.bookType}", ${book.bookStatus},2)`;
    try{
        let sql = `INSERT INTO book(name, author, description, reptileType, type,updateTime,bookType,bookStatus,isJin) VALUES ("${book.title}","${tool.toSql(book.author)}","${tool.toSql(book.description)}", ${book.reptileType}, ${book.type}, date_sub("${book.updateTime}",interval 0 day), "${book.bookType}", ${book.bookStatus},${book.isJin})`;
        await db.query(sql);
    }catch(err) {

        res.send(tool.toJson(null, `你的小说添加失败，失败原因：${err}`, 1002));
        return;
    }






    res.send(tool.toJson("你的小说添加成功", null, 1000));
});

module.exports = router;
