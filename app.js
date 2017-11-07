var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var photos = require('./routes/photos');

var session = require('express-session');
var util = require('util');
var url = require('url')
var sqlite3 = require('sqlite3');
var sqliteHelper = require('./database/sqliteHelper');
var async = require('async');

var app = express();

sqliteHelper.connect(function (err) {
    if (err)
        throw err;
});
app.on('close', function (error) {
    sqliteHelper.disconnect(function (err) {
    });
});

//测试数据库连接
// sqliteHelper.allNotes("users", function (err, result) {
//         if (err) {
//             util.log('ERROR ' + err);
//             throw err;
//         } else {
//             console.log("users1:" + result[0].userName);
//             util.log('users2:' + result);
//         }
//     }
// );
// var x = null;
// async.series([function (cb) {
//     sqliteHelper.findNoteById("users", "userName", "xkl",
//         function (error, result) {
//             if (error) throw cb(error,null);
//             console.log("users1:" + result.userName);
//             x = result;
//             // cb(null,result);
//         },
//         function (error) {
//             if (error) util.log("fuck");
//             else util.log("good");
//             // x = result;
//             cb();
//         });
// },function (cb) {
//     console.log("result:" + x);
//     cb();
// }],function (error,values) {
//     console.log("zzz")
//     if (error) throw error;
// });



app.use(session({
    secret: 'secret',
    cookie: {
        maxAge: 1000 * 60 * 30
    }
}));

app.use(function (req, res, next) {
    res.locals.user = req.session.user;   // 从session 获取 user对象,转存入本地新定义的user对象中，ejs模板里即可直接使用user对象
    console.log("user:"+res.locals.user);
    var err = req.session.error;   //获取错误信息
    delete req.session.error;
    res.locals.message = "";   // 展示的信息 message
    if (err) {
        res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">' + err + '</div>';
    }
    next();  //中间件传递
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/users', users);
app.use('/photos',photos);
// app.use('/login', users);
// app.use('/register', users); // 即为为路径 /register 设置路由
// app.use("/logout", users); // 即为为路径 /logout 设置路由

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
