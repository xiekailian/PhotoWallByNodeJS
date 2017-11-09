var express = require('express');
var router = express.Router();
var photosHandler = require('../logic/photosHandler');
var async = require('async');
var formidable = require('formidable'),
    fs = require('fs'),
    TITLE = 'photos上传',
    PHOTOS_UPLOAD_FOLDER = '/photos/',
    PHOTOS_TEMP_FOLDER = '/temp/',
    PHOTOS_ABSOLUTE_FOLDER = "D:\\workspace\\web_exploring\\NodeJS\\PhotoWall\\public\\photos\\",
    domain = "http://localhost:3000";

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.route("/myPhotos").get(function (req, res) {
    res.render('photos', {title: 'Photos'});
}).post(function (req, res) {
    let form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = 'public' + PHOTOS_TEMP_FOLDER;     //设置上传文件的缓存目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    form.parse(req, function (err, fields, files) {

        if (err) {
            res.locals.error = err;
            res.render('index', {title: TITLE});
            return;
        }
        console.log("The file is:");
        console.log(files);

        let extName = '';  //后缀名
        switch (files.fulAvatar.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }
        console.log("extName:" + extName);
        console.log("extName length:" + extName.length);

        if (extName.length == 0) {
            res.locals.error = '只支持png和jpg格式图片';
            res.render('index', {title: TITLE});
            console.log("extName done.");
            //删除缓存区的文件
            let tempPath = files.fulAvatar.path;
            fs.unlink(tempPath, function (err) {
                if (err) throw err;
                console.log('成功')
            });
        }
        else {
            //相对项目根目录的用户照片文件夹路径，fs.renameSync使用相对根目录的路径
            let userPhotoPath = PHOTOS_UPLOAD_FOLDER + res.locals.user.userName + '/';
            console.log("save the file.");
            let photoName = Math.random() + '.' + extName;
            //图片写入地址，不同用户文件夹不一样；
            let newPath = 'public' + userPhotoPath + photoName;
            //显示地址；
            let showUrl = domain + userPhotoPath + photoName;
            //用户照片文件夹的绝对路径，因为fs.mkdir创建文件夹必须使用绝对路径
            let userPhotoFolderPath = PHOTOS_ABSOLUTE_FOLDER + res.locals.user.userName;
            async.series([  //async.series函数可以控制函数按顺序执行，从而保证最后的函数在所有其他函数完成之后执行
                    function (cb) {
                        //判断用户的照片文件夹是否存在，不存在就创建一个
                        fs.exists(userPhotoFolderPath, function (exists) {
                            if (!exists) {
                                console.log('文件夹不存在');
                                fs.mkdir(userPhotoFolderPath, function (err) {
                                    if (err)
                                        console.error(err);
                                    console.log('创建目录成功');
                                    cb();
                                });
                            }
                            else {
                                console.log('文件夹存在');
                                cb();
                            }
                        });
                    },
                    function (cb) {
                        console.log("newPath", newPath);
                        fs.renameSync(files.fulAvatar.path, newPath);  //重命名暂存在缓存区的图片文件，相当于将其移动到用户照片文件夹下
                        photosHandler.addIntoAPhotoTable(res.locals.user.userName, photoName, userPhotoPath + photoName);
                        res.json({
                            "newPath": showUrl
                        });
                        cb();
                    }
                ],
                function (error, results) {
                    if (error) util.log('ERROR ' + error);
                }
            );
        }
    });

});

module.exports = router;