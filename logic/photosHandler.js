//user数据库接口库
var util = require('util');
var sqliteHelper = require('../database/sqliteHelper');
var async = require('async');
var tableName = "users";
var colNames = ["userName", "password"];
var keyName = "userName";

/*
将一个用户的一张照片数据存入其的照片表，若表已存在则不创建，直接加入，若不存在则创建后再加入
 */
exports.addIntoAPhotoTable = function (userName, photoName, photoPath) {
    let tableName = userName + "_photos"
    sqliteHelper.setup(tableName, ["photoName", "photoPath"], ["VARCHAR(255)", "VARCHAR(255)"],
        function (error) {
            if (error) {
                util.log('ERROR ' + error);
                throw error;
            }
            async.series([  //async.series函数可以控制函数按顺序执行，从而保证最后的函数在所有其他函数完成之后执行
                    function (cb) {
                        sqliteHelper.add(tableName, ["photoName", "photoPath"], [photoName, photoPath],
                            function (error) {
                                if (error) util.log('ERROR ' + error);
                                cb(error);
                            });
                    }
                ],
                function (error, results) {
                    if (error) util.log('ERROR ' + error);
                }
            );
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
