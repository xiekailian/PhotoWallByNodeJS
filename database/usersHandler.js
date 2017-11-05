//user数据库接口库
var util = require('util');
var sqliteHelper = require('./sqliteHelper');
var async = require('async');
var tableName = "users";
var colNames = ["userName", "password"];
var keyName = "userName";

exports.addAUser = function (values, callback) {
    let user = null;
    let addStatus = 0;
    // let userName = null;

    async.series([function (cb) {
        sqliteHelper.findNoteById(tableName, keyName, values[0],
            function (error, result) {
                if (error) throw cb(error, null);
                console.log("users1:" + result.userName);
                user = result;
                // cb(null,result);
            },
            function (error) {
                if (error) throw cb(error, null);
                cb(null);
            });
    }, function (cb) {
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
                    }
                    cb(error);
                });
        }
        else {
            callback(null, 2);
            cb();
        }

    }], function (error, values) {
        console.log("zzz")
        if (error) throw error;
    });

}
/*
run函数接受一个字符串参数，其中?表示占位符，占位符的值必须通过一个数组传递进来
调用者提供了一个回调函数，然后通过这个回调函数来声明错误
 */
exports.delete = function (ts, callback) {
    db.run("DELETE FROM notes WHERE ts = ?;",
        [ts],
        function (err) {
            if (err) {
                util.log('FAIL to delete ' + err);
                callback(err);
            } else {
                callback(null);
            }
        });
}
exports.edit = function (ts, author, note, callback) {
    db.run("UPDATE notes " +
        "SET ts = ?, author = ?, note = ? " +
        "WHERE ts = ?",
        [ts, author, note, ts],
        function (err) {
            if (err) {
                util.log('FAIL on updating table ' + err);
                callback(err);
            } else {
                callback(null);
            }
        });
}
exports.allNotes = function (callback) {
    util.log(' in allnote');
    db.all("SELECT * FROM notes", callback);
}
exports.forAll = function (doEach, done) {
    db.each("SELECT * FROM notes", function (err, row) {
        if (err) {
            util.log('FAIL to retrieve row ' + err);
            done(err, null);
        } else {
            doEach(null, row);
        }
    }, done);
}
/*
allNotes和forAll函数是操作所有数据的两种方法，allNotes把数据库中所有的数据行收集到一个数组里，
而forAll方法可以接受两个回调函数，每当从数据集中拿一行数据，回调函数doEach都会执行一遍，当读完所有数据时，回调函数done就会执行
 */
exports.findNoteById = function (ts, callback) {
    var didOne = false;
    db.each("SELECT * FROM notes WHERE ts = ?",
        [ts],
        function (err, row) {
            if (err) {
                util.log('FAIL to retrieve row ' + err);
                callback(err, null);
            } else {
                if (!didOne) {
                    callback(null, row);
                    didOne = true;  //保证回调函数只被执行一次
                }
            }
        });
}
