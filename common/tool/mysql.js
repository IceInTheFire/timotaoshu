const mysql = require('mysql');
const async = require('async');
const config = require('../../config/sql');



const pool  = mysql.createPool(config);


/*
* 普通连接
* */
const query = (sql) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if(err){
                reject(err);
                return;
            }
            try{
                connection.query(sql, function (error, results, fields) {
                    connection.release();
                    if(error){
                        reject(error);
                        return;
                    }
                    resolve(results);
                });
            }catch(err) {
                connection.release();
                reject(error);
                return;
            }

        })
    })
}

/*
* 事务封装
* */
function execTrans(sqlparamsEntities) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            }
            connection.beginTransaction(function (err) {
                if (err) {
                    reject(err);
                }
                console.log("开始执行transaction，共执行" + sqlparamsEntities.length + "条数据");
                var funcAry = [];
                sqlparamsEntities.forEach(function (sql) {
                    var temp = function (cb) {
                        connection.query(sql, function (tErr, rows, fields) {
                            if (tErr) {
                                connection.rollback(function () {
                                    console.log("事务失败，" + sql_param + "，ERROR：" + tErr);
                                    throw tErr;
                                });
                            } else {
                                return cb(null, 'ok');
                            }
                        })
                    };
                    funcAry.push(temp);
                });

                async.series(funcAry, function (err, result) {
                    console.log("transaction error: " + err);
                    if (err) {
                        connection.rollback(function (err) {
                            console.log("transaction error: " + err);
                            connection.release();
                            // return callback(err, null);
                            reject(err);
                        });
                    } else {
                        connection.commit(function (err, info) {
                            console.log("transaction info: " + JSON.stringify(info));
                            if (err) {
                                console.log("执行事务失败，" + err);
                                connection.rollback(function (err) {
                                    console.log("transaction error: " + err);
                                    connection.release();
                                    // return callback(err, null);
                                    reject(err);
                                });
                            } else {
                                connection.release();
                                // return callback(null, info);
                                resolve(info);
                            }
                        })
                    }
                })
            });
        });
    });
}




module.exports = {
    query:query,
    execTrans:execTrans,
    pool: pool
};