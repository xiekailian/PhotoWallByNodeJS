//user数据库操作工具库，封装数据库操作，便于数据层调用
var util = require('util');
var sqlite3 = require('sqlite3');
sqlite3.verbose();
var db = undefined;
/*
 数据库名是直接硬编码的，所以当调用connect和setup函数时，database目录中就会生成phoneWall.sqlite3文件
 */
exports.connect = function (callback) {
    db = new sqlite3.Database("database/phoneWall.sqlite3", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
        function (err) {
            if (err) {
                util.log('FAIL on creating database ' + err);
                callback(err);
            } else {
                callback(null);
            }
        });
}
//此处的disconnect函数是空的
exports.disconnect = function (callback) {
    db.close();
    callback(null);
}
exports.setup = function (tableName, colNames, colTypes, callback) {
    let command = " (";
    for (let i = 0; i < colNames.length; i++) {
        if (i != colNames.length - 1) {
            command += colNames[i];
            command += " ";
            command += colTypes[i];
            command += ", ";
        }
        else {
            command += colNames[i];
            command += " ";
            command += colTypes[i];
            command += ")";
        }
    }
    db.run("CREATE TABLE IF NOT EXISTS " + tableName + command,
        function (err) {
            if (err) {
                util.log('FAIL on creating table ' + err);
                callback(err);
            } else {
                callback(null);
            }
        });
}
exports.emptyNote = {"ts": "", author: "", note: ""};
//tableName为表名，colName为表格的列名数组，value为对应各列的数值数组
exports.add = function (tableName, colNames, values, callback) {
    let command = "INSERT INTO " + tableName + " (";
    let valuesCommand = "VALUES ("
    for (let i = 0; i < colNames.length; i++) {
        if (i != colNames.length - 1) {
            command += colNames[i];
            command += ", ";
            valuesCommand += "?, ";
        }
        else {
            command += colNames[i];
            valuesCommand += "?);";
        }
    }
    command += ") ";
    db.run(command + valuesCommand, values,
        function (error) {
            if (error) {
                util.log('FAIL on add ' + error);
                callback(error);
            } else {
                callback(null);
            }
        });
}
/*
run函数接受一个字符串参数，其中?表示占位符，占位符的值必须通过一个数组传递进来
调用者提供了一个回调函数，然后通过这个回调函数来声明错误
 */
// exports.delete = function (ts, callback) {
//     db.run("DELETE FROM notes WHERE ts = ?;",
//         [ts],
//         function (err) {
//             if (err) {
//                 util.log('FAIL to delete ' + err);
//                 callback(err);
//             } else {
//                 callback(null);
//             }
//         });
// }
exports.edit = function (tableName, colNames, values, callback) {
    let command = "UPDATE " + tableName + " SET ";
    let valuesCommand = values.push(values[0]);
    for (let i = 0; i < colNames.length; i++) {
        if (i != colNames.length - 1) {
            command += colNames[i];
            command += " = ?, ";
        }
        else {
            command += colNames[i];
            command += " = ? ";
        }
    }
    command = command + "WHERE " + colNames[0] + " = ?";
    db.run(command, valuesCommand,
        function (err) {
            if (err) {
                util.log('FAIL on updating table ' + err);
                callback(err);
            } else {
                callback(null);
            }
        });
}
exports.allNotes = function (tableName, callback) {
    util.log(' in allnote');
    db.all("SELECT * FROM " + tableName, callback);
}
exports.forAll = function (tableName, doEach, done) {
    db.each("SELECT * FROM " + tableName, function (err, row) {
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
exports.findNoteById = function (tableName, keyName, keyValue, success) {
    var didOne = false;
    db.each("SELECT * FROM " + tableName + " WHERE " + keyName + " = ?",
        [keyValue],
        function (err, row) {
            if (err) {
                util.log('FAIL to retrieve row ' + err);
                success(err, null);
            } else {
                if (!didOne) {
                    console.log("success!");
                    success(null, row);
                    didOne = true;  //保证回调函数只被执行一次
                }
            }
        });
}
