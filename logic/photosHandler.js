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
获得一个用户的所有照片路径
 */
exports.getUserPhotoPaths = function (userName, callback) {
    let userPhotoTableName = userName + "_photos";
    let userPhotoPaths = [];
    sqliteHelper.forAll(userPhotoTableName, function (error, userPhoto) {
        userPhotoPaths.push(userPhoto.photoPath);
    }, function (error) {
        if (error) {
            util.log('Fail on get photoPaths because of error:' + error);
            callback(error, null);
        }
        else {
            callback(null, userPhotoPaths);
        }
    });
}

exports.deleteUserPhoto = function (userName, photoPath, callback) {
    let userPhotoTableName = userName + "_photos";
    let colName = "photoPath";
    sqliteHelper.delete(userPhotoTableName, colName, photoPath, function (error) {
        if (error) {
            util.log('Fail on delete:' + error);
            callback(error);
        }
        else {
            callback(null);
        }
    })
}
