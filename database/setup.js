var util = require('util');
var async = require('async');  //npm install async
var sqliteHelper = require('./sqliteHelper');
sqliteHelper.connect(function (error) {
    if (error) throw error;
});
sqliteHelper.setup("users", ["userName", "password"], ["VARCHAR(255)", "VARCHAR(255)"],
    function (error) {
        if (error) {
            util.log('ERROR ' + error);
            throw error;
        }
        async.series([  //async.series函数可以控制函数按顺序执行，从而保证最后的函数在所有其他函数完成之后执行
                function (cb) {
                    sqliteHelper.add("users",["userName", "password"], ["xkl", "123"],
                        function (error) {
                            if (error) util.log('ERROR ' + error);
                            cb(error);
                        });
                }
            ],
            function (error, results) {
                if (error) util.log('ERROR ' + error);
                sqliteHelper.disconnect(function (err) {
                });
            }
        );
    });
