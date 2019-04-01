var express = require('express');
var router = express.Router();
const { oauth, tool, db, log } = require("../../tool/require");

/*
*   添加和编辑章节接口
*   name 章节名称
*   type 章节类型
*   num  章节排序
*   bookId 小说id
* */
router.use('', oauth(8003),  async function(req, res, next) {
    let name = tool.getParams(req, 'name');
    let type = tool.getParams(req, 'type');
    let num = parseInt(tool.getParams(req, 'num'));
    let bookId = tool.getParams(req, 'bookId');
    let catalogId = tool.getParams(req, 'catalogId');

    if(!name){
        res.send(tool.toJson(null, '章节名称不能为空', 1002));
        return;
    }
    if(!type){
        res.send(tool.toJson(null, '章节类型不能为空', 1002));
        return;
    }
    if(!bookId){
        res.send(tool.toJson(null, '小说id不能为空', 1002));
        return;
    }

    let book = await db.query(`select author from book where id=${bookId} and type=4`);     //type等于4是本站来源
    if(!book.length){
        res.send(tool.toJson(null, '没有该小说ID，请核对', 1002));
        return;
    }
    let author = book[0].author;

    if(!author){
        res.send(tool.toJson(null, '小说作者不能为空', 1002));      //不可能进来
        return;
    } else if(author != req.user.name){
        res.send(tool.toJson(null, `您不是该小说的作者，故不能${catalogId?"编辑":"添加"}章节`, 1002));
        return;
    }
    if(num === 0 || num > 0) {
        if(num > 1000000000) {
            res.send(tool.toJson(null, `序号NUM过大，故不能${catalogId?"编辑":"添加"}章节，NUM序号最大不能10位数`, 1002));
            return;
        }
        let catalogList = "";
        if(catalogId){
            catalogList = await db.query(`select num from catalog where bookId = ${bookId} and num=${num} and id!=${catalogId};`);
        }else{
            catalogList = await db.query(`select num from catalog where bookId = ${bookId} and num=${num};`);
        }

        if(catalogList.length){
            res.send(tool.toJson(null, `序号NUM重复，故不能${catalogId?"编辑":"添加"}章节`, 1002));
            return;
        }

    } else {        //没有num值，默认给最大值
        let catalogList = await db.query(`select max(num) from catalog where bookId = ${bookId};`);
        num = 0;
        if(catalogList[0]["max(num)"]) {
            num = catalogList[0]["max(num)"] + 2;
        }
    }

    if(catalogId) { //编辑
        await db.query(`update catalog set name="${tool.toSql(name)}" , num=${num}, type=${type} where id = ${catalogId}`);
    } else {        //新增
        await db.query(`INSERT INTO catalog (bookId, name, num, type, createTime, isReptileTool) VALUES
                    (${bookId},"${tool.toSql(name)}", ${num}, ${type}, now(), 1)`
        );
    }




    res.send(tool.toJson(`你的章节${catalogId?"编辑":"添加"}成功`, null, 1000));
});

module.exports = router;
