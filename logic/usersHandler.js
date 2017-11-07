//user数据库接口库
var util = require('util');
var sqliteHelper = require('../database/sqliteHelper');
var async = require('async');
var tableName = "users";
var colNames = ["userName", "password"];
var keyName = "userName";

/*
添加一个用户
 */
exports.addAUser = function (values, callback) {
    let user = null;

    async.series([function (cb) {
        //顺序执行的代码一
        sqliteHelper.findNoteById(tableName, keyName, values[0],
            function (error, result) {
                if (error) throw error;
                // console.log("users1:" + result.userName);
                user = result;
                // cb(null,result);
            },
            function (error) {
                if (error) throw cb(error, null);
                //回调函数中也要传入cb，否则如果cb放在回调函数之外则无法完成同步
                cb(null);
            });
    }, function (cb) {
        //顺序执行的代码二
        //0代表error,1代表成功添加用户,2代表用户已存在无法添加
        if (user === null) {
            sqliteHelper.add("users", colNames, values,
                function (error) {
                    if (error) {
                        util.log('Fail on add a user:' + values[0] + 'because of error:' + error);
                        callback(error, 0);
                    }
                    else {
                        callback(null, 1);
                        // console.log("exist");
                    }
                    //回调函数中也要传入cb，否则如果cb放在回调函数之外则无法完成同步
                    cb(error);
                });
        }
        else {
            callback(null, 2);
            cb();
        }

    }], function (error, values) {
        // console.log("zzz")
        if (error) throw error;
    });

}
/*
用户登录判断
 */
exports.loginAUser = function (values, callback) {
    let user = null;
    // let userName = null;
    // console.log("userName2:"+values[0]);
    async.series([function (cb) {
        sqliteHelper.findNoteById(tableName, keyName, values[0],
            function (error, result) {
                if (error) throw cb(error, null);
                // console.log("users1:" + result.userName);
                user = result;
                // cb(null,result);
            },
            function (error) {
                if (error) throw cb(error, null);
                cb(null);
            });
    }, function (cb) {
        //0代表error,1代表成功登录,2代表用户不存在无法登录,3代表用户密码错误
        if (user === null) {
            sqliteHelper.add("users", colNames, values,
                function (error) {
                    if (error) {
                        util.log('Fail on add a user:' + values[0] + 'because of error:' + error);
                        callback(error, 0, user);
                    }
                    else {
                        callback(null, 2, user);
                        // console.log("exist");
                    }
                    cb(error);
                });
        }
        else {
            console.log("user exist" + user.password + "values[1]" + values[1]);
            if (user.password === values[1]) {
                callback(null, 1, user);
            }
            else {
                callback(null, 3, user);
            }
            cb();
        }
    }], function (error, values) {
        // console.log("zzz")
        if (error) throw error;
    });

}
