const jwt = require('jwt-simple');
const crypto = require('crypto');
const redisConfig = require("../../config/redis")
const redis = require("redis"),
    RDS_PORT = redisConfig.RDS_PORT,            //服务器端口
    RDS_HOST = redisConfig.RDS_HOST,     //服务器ip
    RDS_OPTS = redisConfig.RDS_OPTS,              //设置值
    RDS_PWD  = redisConfig.RDS_PWD,             //密码
    // RDS_PWD  = "",             //密码
    db15 = 15,                    //用来存放authorList
    db1 = 1,                     //用来存放uid
    db0 = 0,                     //用来存放token
    client = redis.createClient({port:RDS_PORT, host:RDS_HOST,RDS_OPTS,password:RDS_PWD, db : db0}),       //token->uid, 这个用kv
    client2 = redis.createClient({port:RDS_PORT, host:RDS_HOST,RDS_OPTS,password:RDS_PWD, db : db1}),       //uid->token, 这个用hash
    client3 = redis.createClient({port:RDS_PORT, host:RDS_HOST,RDS_OPTS,password:RDS_PWD,db : db15});



const key = 'timotao22';

client.auth(RDS_PWD,function(){
    console.log('通过认证1');
});
client2.auth(RDS_PWD,function(){
    console.log('通过认证2');
});
client3.auth(RDS_PWD,function(){
    console.log('通过认证3');
});
client.on('error', function (err) {
    // client.set('author', 'Wilson',redis.print);
    // client.get('author', redis.print);
    console.log('Error ' + err);
});
client.on('ready', function(){
    console.log("redis ok")
});

// client2.on('error', function (err) {
//     client2.set('author', 'Wilson',redis.print);
//     client2.get('author', redis.print);
//     console.log('Error ' + err);
// });
// client2.on('ready', function(){
//     console.log("redis ok")
// });
//
// client3.on('error', function (err) {
//     client3.set('author', 'Wilson',redis.print);
//     client3.get('author', redis.print);
//     console.log('Error ' + err);
// });
// client3.on('ready', function(){
//     console.log("redis ok")
// });

/*
*
* Redis支持五种数据类型：string（字符串），hash（哈希），list（列表），set（集合）及zset(sorted set：有序集合)。
*
* */

function sha1(str) {
    let md5sum = crypto.createHash('sha1');   //md5有一定的碰撞问题
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
}


// 1.lpush
// 在key对应 list的头部添加字符串元素
//
// 2.rpush
// 在key对应 list 的尾部添加字符串元素

let redisData = {
    token : {
        /*
        * 更改了用户信息，
        * 用user重置下tokne的值
        * */
        reSetToken: async (user, token) => {
            return redisData.token.setToken(user, token);
        },
        /*
        * 用token换取user
        * 若没有user则返回空
        * */
        getUser: async (token) => {
            let userId = null;
            let jwtTokenStr = await new Promise(function(resolve, reject) {
                client.get(token, function(err, reply) {
                    if(!reply) {
                        resolve("");
                        return;
                    }
                    userId = reply;
                    client2.hget(reply, token, function(err, reply) {
                        resolve(reply?reply:'');
                    });
                    // resolve(reply?reply:'');
                });
            });
            // console.log(jwtTokenStr);
            if(jwtTokenStr) {
                let jwtToken = jwtTokenStr.substring(0, jwtTokenStr.length - 13);
                let date = jwtTokenStr.substring(jwtTokenStr.length - 13, jwtTokenStr.length);
                let user = '';
                try{
                    user = jwt.decode(jwtToken, key + date);
                    return user;
                } catch(err) {
                    if(userId) {    //删除跟该token有关的值
                        client.del(token, client.print);
                        client2.hdel(userId, jwtTokenStr, client2.print);
                    }
                    return "";
                }
            } else {
                return "";
            }
        },
        /*
        * 删除成功则返回true
        * */
        removeToken: async (userId) => {
            try{
                client2.hgetall(userId, (err, obj) => {
                    // console.log(obj)
                    if(!obj) obj = [];
                    Object.keys(obj).forEach((value, index) => {
                        client.del(value, client.print);
                        client2.hdel(userId, value, client.print);
                    });
                });
                client2.del(userId);
                return true;
            } catch(err) {
                // console.log(err);
                return false;
            };
        },
        /*
        * 用user换取token
        * 这里后期再考虑要不要使用Promise异步
        * */
        setToken:async (user, token) => {

            let date = new Date().getTime();
            /*
             * 第一个参数是user  用户信息
             * 第二个参数，是key值
             * */
            let jwtToken = jwt.encode(user, key + date) + date;
            token =  token || sha1(jwtToken);
            client.set(token, user.id)
            client.expire(token, 60*60*24*30);  //  缓存30天
            let obj = {};
            obj[token] = jwtToken;
            client2.hmset(user.id, obj, (err, reply) => {
                if(err) throw err;
                else {
                    client2.hgetall(user.id, (err, obj) => {
                        Object.keys(obj).forEach((value, index) => {
                            if(value != token) {
                                client.del(value, client.print);
                                client2.hdel(user.id, value, client.print);
                            }
                        });
                    });
                }
            });

            /*
            * 顶掉其他token的操作
            * */
            // client.keys('token-' + user.id + '-*', function (err, replies) {
            //     console.log(replies.length + " replies:");
            //     replies.forEach(function (reply, i) {
            //         console.log("    " + i + ": " + reply);
            //         if(('token-' + user.id + '-' + token) != reply) {
            //             redisData.token.removeToken(reply);
            //         }
            //     });
            // });
            return token;
        },
    },
    authorList: {
        setAuthorList:async (authorList) => {
            authorList.forEach((value, index) => {
                client3.rpush('authorList', JSON.stringify(value), client3.print);
            });

            client3.expire("authorList", 60*60*24);  //  缓存1天
        },
        updateAuthorList: async(authorList) => {
            await client3.del('authorList', client3.print);
            return new Promise(async (resolve, reject) => {
                let length = authorList.length;
                authorList.forEach((value, index) => {
                    if(index == length -1) {
                        client3.rpush('authorList', JSON.stringify(value), (err, reply) => {
                            resolve();
                        });
                    } else {
                        client3.rpush('authorList', JSON.stringify(value), client3.print);
                    }
                });
                client3.expire("authorList", 60*60*24);  //  缓存1天
            });
        },
        getAuthorList: async (startIndex, endIndex) => {
            let authorList = new Promise((resolve, reject)=>{
                client3.lrange('authorList',startIndex,endIndex, function(err,reply) {
                    if(err) reject(err);
                    if(reply) resolve(reply);
                });
            });
            return authorList;
        },
        getAuthorCount: async () => {
            let count = new Promise((resolve, reject)=>{
                client3.llen('authorList', function(err,reply) {
                    if(err) reject(err);
                    if(reply>=0) resolve(reply);
                });
            });
            return count;
        }
    },
    bookTypeList: {
        setBookTypeList:async (bookTypeList) => {
            bookTypeList.forEach((value, index) => {
                client3.rpush('bookTypeList', JSON.stringify(value), client3.print);
            });

            client3.expire("bookTypeList", 60*60*24);  //  缓存1天
        },
        updateBookTypeList: async(bookTypeList) => {
            await client3.del('bookTypeList');

            return new Promise((resolve, reject) => {
                let length = bookTypeList.length;
                bookTypeList.forEach((value, index) => {
                    if(index == length -1) {
                        client3.rpush('bookTypeList', JSON.stringify(value), (err, reply) => {
                            resolve();
                        });
                    } else {
                        client3.rpush('bookTypeList', JSON.stringify(value), client3.print);
                    }
                });

                client3.expire("bookTypeList", 60*60*24);  //  缓存1天
            });
        },
        getBookTypeList: async (startIndex, endIndex) => {
            let authorList = new Promise((resolve, reject)=>{
                client3.lrange('bookTypeList',startIndex,endIndex, function(err,reply) {
                    if(err) reject(err);
                    if(reply) resolve(reply);
                });
            });
            return authorList;
        },
        getBookTypeCount: async () => {
            let count = new Promise((resolve, reject)=>{
                client3.llen('bookTypeList', function(err,reply) {
                    if(err) reject(err);
                    if(reply>=0) resolve(reply);
                });
            });
            return count;
        }
    },
    reptileList: {
        setReptileList : async (reptileList) => {
            reptileList.forEach((value, index) => {
                client3.rpush('reptileList', JSON.stringify(value), client3.print);
            });

            client3.expire("reptileList", 60*60*24);  //  缓存1天
        },
        updateReptileList: async (reptileList) => {
            await client3.del('reptileList', client3.print);
            return new Promise(async (resolve, reject) => {
                let length = reptileList.length;
                reptileList.forEach((value, index) => {
                    if(index == length -1) {
                        client3.rpush('reptileList', JSON.stringify(value), (err, reply) => {
                            resolve();
                        });
                    } else {
                        client3.rpush('reptileList', JSON.stringify(value), client3.print);
                    }
                });
                client3.expire("reptileList", 60*60*24);  //  缓存1天
            });
        },
        getReptileList: async (startIndex, endIndex) => {
            let reptileList = new Promise((resolve, reject)=>{
                client3.lrange('reptileList',startIndex,endIndex, function(err,reply) {
                    if(err) reject(err);
                    if(reply) resolve(reply);
                });
            });
            return reptileList;
        },
        getReptileCount: async () => {
            let count = new Promise((resolve, reject)=>{
                client3.llen('reptileList', function(err,reply) {
                    if(err) reject(err);
                    if(reply>=0) resolve(reply);
                });
            });
            return count;
        }
    },
    ipList:{
        setIpList : async (ipList) => {
            ipList.forEach((value, index) => {
                client3.rpush('ipList', JSON.stringify(value), client3.print);
            });

            // client3.expire("ipList", 60*60*24);  //  缓存1天
        },
        updateIpList: async (ipList) => {
            await client3.del('ipList', client3.print);
            return new Promise(async (resolve, reject) => {
                let length = ipList.length;
                ipList.forEach((value, index) => {
                    if(index == length -1) {
                        client3.rpush('ipList', typeof value == "object" ? JSON.stringify(value) : value, (err, reply) => {
                            resolve();
                        });
                    } else {
                        client3.rpush('ipList', typeof value == "object" ? JSON.stringify(value) : value, client3.print);
                    }
                });
                // client3.expire("ipList", 60*60*24);  //  缓存1天
            });
        },
        getIpList: async (startIndex, endIndex) => {
            let reptileList = new Promise((resolve, reject)=>{
                client3.lrange('ipList',startIndex,endIndex, function(err,reply) {
                    if(err) reject(err);
                    if(reply) resolve(reply);
                });
            });
            return reptileList;
        },
        getIpCount: async () => {
            let count = new Promise((resolve, reject)=>{
                client3.llen('ipList', function(err,reply) {
                    if(err) reject(err);
                    if(reply>=0) resolve(reply);
                });
            });
            return count;
        },
        delIpValue: async (value, count2) => {
            let del = new Promise((resolve, reject)=>{
                let count = 0;
                if(!isNaN(count2)) {
                    count = count2;
                }

                //删掉count个 跟value值一样的
                /*
                *   从key对应 list 中删除 count 个和 value 相同的元素。
                *   count > 0 : 从表头开始向表尾搜索，移除与 VALUE 相等的元素，数量为 COUNT 。
                *   count < 0 : 从表尾开始向表头搜索，移除与 VALUE 相等的元素，数量为 COUNT 的绝对值。
                *   count = 0 : 移除表中所有与 VALUE 相等的值。
                * */
                client3.lrem('ipList', count, value, function(err,reply) {
                    if(err) reject(err);
                    if(reply) resolve(reply);
                });
            });
            return del;
        },
        updateIpIndex: async (index, value) => {
            let update = new Promise((resolve, reject) => {
                let value2 = typeof value == "object" ? JSON.stringify(value) : value;
                client3.lset('ipList', index, value2, function(err,reply) {
                    console.log("index:" + index);
                    if(err) reject(err);
                    if(reply) resolve(reply);
                });
            });
            return update;
        },
        delIpFromIndex: async (index) => {
            return new Promise(async (resolve, reject) => {
                let count = await redisData.ipList.getIpCount();
                let indexs = index.split(',');
                indexs.forEach((value, index) => {
                    if(value > count) {
                        // reject(`${value}超过了代理ip的长度`)
                        resolve();
                        return;
                    }
                });
                let i = 0, length = indexs.length;
                for(i; i<length; i++) {
                    let ii = indexs[i];
                    await redisData.ipList.updateIpIndex(ii, `{"ipList${ii}":"ipList${ii}"}`);
                }
                for(i = 0; i<length; i++){
                    let ii = indexs[i];
                    await redisData.ipList.delIpValue(`{"ipList${ii}":"ipList${ii}"}`, 1);
                }
                // await redisData.ipList.updateIpIndex(index, `{ipList${index}:ipList${index}}`);
                // await redisData.ipList.delIpValue(`{ipList${index}:ipList${index}}`, 1);
                resolve(true);
            });
        },
        getAllIpList: async () => {
            return new Promise(async (resolve, reject) => {
                try{
                    let length = await redisData.ipList.getIpCount();
                    let ipList = await redisData.ipList.getIpList(0, length - 1);
                    resolve(ipList);
                }catch(err) {
                    log.error(err);
                    resolve([]);
                }
            });

        },
        getRandomIpList: async () => {
            return new Promise(async (resolve, reject) => {
                try{
                    let length = await redisData.ipList.getIpCount();
                    if(length > 0) {
                        let random = Math.floor(Math.random() * length);
                        let ipList = await redisData.ipList.getIpList(random, random + 1);
                        let ipObj = JSON.parse(ipList[0]);
                        resolve(`${ipObj.protocol}://${ipObj.ip}:${ipObj.port}`);
                    } else {
                        console.error("代理IP池里没有代理IP了，需要填充了");
                        resolve();
                    }
                }catch(err) {
                    console.error(err);
                    resolve();//报错则返回null
                }
            });
        }
    }
}


module.exports = redisData;