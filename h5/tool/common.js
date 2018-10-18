const { tool, db, log } = require("./require");

const common = {
    listBatch: async function(type, bookIds, bookNames) {
        let bookIdArr;
        let bookNameArr;
        if(type == "1") {
            bookIdArr = bookIds.split(",");
            let i = 0, length = bookIdArr.length;
            for(i; i<length; i++) {
                let value = bookIdArr[i];
                if(!tool.strIsInt(value)){
                    // res.send(tool.toJson(null, '当type为1时，bookIds参数有误', 1002));
                    return {
                        error:'当type为1时，bookIds参数有误'
                    };
                    break;
                }
            }
        } else if(type == "2") {
            bookNameArr = bookNames.split(",");
        }

        let books, count, sql;
        let searchSqlStart = `select id,name,author,description,reptileType,OriginUrl,type,updateTime,bookStatus,bookType,isJin from book`;
        let searchSqlEnd = ``;
        if(type == "1") {
            sql = `where id IN(${bookIds}) and isJin=1 and type=3`;
            searchSqlEnd = `order by FIND_IN_SET(id,'${bookIds}')`;
        } else if(type == "2") {
            sql = `where name IN(`;
            let bookNameArrLength = bookNameArr.length;
            bookNameArr.forEach((value, index) => {
                if(bookNameArrLength == index + 1) {
                    sql += `"${value}")`;
                } else {
                    sql += `"${value}", `;
                }
            });
            searchSqlEnd = `order by FIND_IN_SET(name,"${bookNames}")`;
        }

        try{
            books = await db.query(`${searchSqlStart} ${sql} ${searchSqlEnd}`);
            count = (await db.query(`select count(*) from book ${sql}`))[0]["count(*)"];
        }catch(err) {
            // res.send(tool.toJson(null, '数据出错', 1002));
            return {
                error:'数据出错'
            };
            // return;
        }
        if(type == "1") {
            bookIdArr.forEach((value, index) => {
                if(typeof books[index] != "object" || (typeof books[index] == "object" && parseInt(value) != books[index].id)) {
                    books.insert(index, {id:value,msg:"没有此书"});
                }
            })
        } else if(type == "2") {
            bookNameArr.forEach((value, index) => {
                if(typeof books[index] != "object" || (typeof books[index] == "object" && value != books[index].name)) {
                    books.insert(index, {name:value,msg:"没有此书"});
                }
            })
        }

        return {
            count: count,
            book: books
        }
    }
}


module.exports = common;