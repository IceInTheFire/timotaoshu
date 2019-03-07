const {fs, rp, timoRp, cheerio, iconv, path, tool, log, db, queue} = require("../../tool/require2");

//检查所有的书
checkAllBook();



//检查所有的书
async function checkAllBook() {
    // let books = await db.query(`select * from book where type = 3 and isJin=1`);    //检查所有已爬取并启用的书
    let books = await db.query(`select * from book where type = 3`);    //检查所有已爬取的书
    let i = 0, length = books.length;
    for (i; i < length; i++) {
        console.log(`共检查${books.length}本，现在正检查第${i}本`)
        await getCatalog(books[i].id);
    }
}


async function getCatalog(bookId) {
    let books = await db.query(`select * from book where id=${bookId}`);
    if (books.length < 0) {
        return;
    }
    let book = books[0];
    // console.log(book);
    let catalogArr = await db.query(`select * from catalog where bookId= ${bookId}`);
    console.log(`bookId为${bookId}共${catalogArr.length}章`)
    let i = 0, length = catalogArr.length;
    let emptyArr = [];
    for (i; i < length; i++) {
        let hasCatalog = await checkCatalog(catalogArr[i].id);
        if (!hasCatalog) {
            emptyArr.push(catalogArr[i])
        }
    }
    // console.log(emptyArr);
    if (emptyArr.length > 0) {

        // console.log(`sql执行语法：update book set isJin=1 where id=${bookId}`);
        await db.query(`update book set isJin=2 where id=${bookId}`);   //将书改为禁止状态
        //
        let insertSql = `insert into progresserror (reptileType, originUrl, bookId, catalogId, reptileAddress, bookName, catalogName)`;
        let addArr = [];
        emptyArr.forEach((value, index) => {
            addArr.push(`(${book.reptileType}, "${book.originUrl}", ${bookId}, ${value.id}, "${value.reptileAddress}", "${tool.toSql(book.name)}", "${tool.toSql(value.name)}")`);
        });
        insertSql += `VALUES ${addArr.join(", ")}`;
        // console.log(`sql执行语法:${insertSql}`);
        await db.query(`${insertSql}`);
        //
        //
        // await db.query(`INSERT INTO progresserror (reptileType, originUrl, bookId, catalogId, reptileAddress, bookName, catalogName)
        // VALUES (${reptileType}, "${baseUrl}", "${bookId}", "${catalog.id}", "${catalog.reptileAddress}", "${bookName}", "${catalog.name}")`);

    }
}


/*
* 检查章节里有没有内容
* 如果有，则返回true
* 如果没有，则返回false
* */
async function checkCatalog(catalogId) {
    let catalogArr = await db.query(`select * from catalogcontent${await tool.getCatalogNum(catalogId)} where catalogId = ${catalogId}`);
    if (catalogArr.length > 0) {
        return true;
    } else {
        return false;
    }
}