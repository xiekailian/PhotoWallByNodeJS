var express = require('express');
var router = express.Router();
var photosHandler = require('../logic/photosHandler');
var formidable = require('formidable'),
    fs = require('fs'),
    TITLE = 'photos上传',
    PHOTOS_UPLOAD_FOLDER = '/photos/',
    PHOTOS_TEMP_FOLDER = '/temp/',
    domain = "http://localhost:3000";

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.route("/myPhotos").get(function (req, res) {
    res.render('photos', { title: 'Photos' });
}).post(function (req, res) {
    let form = new formidable.IncomingForm();   //创建上传表单
    form.encoding = 'utf-8';        //设置编辑
    form.uploadDir = 'public' + PHOTOS_TEMP_FOLDER;     //设置上传文件的缓存目录
    form.keepExtensions = true;     //保留后缀
    form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小

    form.parse(req, function(err, fields, files) {

        if (err) {
            res.locals.error = err;
            res.render('index', { title: TITLE });
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
        console.log("extName:"+extName);
        console.log("extName length:"+extName.length);

        if(extName.length == 0){
            res.locals.error = '只支持png和jpg格式图片';
            res.render('index', { title: TITLE });
            console.log("extName done.");
            //删除缓存区的文件
            let tempPath = files.fulAvatar.path;
            fs.unlink(tempPath,function (err) {
                if(err) throw err;
                console.log('成功')
            });
        }
        else{
            console.log("save the file.");
            let photoName = Math.random() + '.' + extName;
            //图片写入地址；
            let newPath = 'public'+PHOTOS_UPLOAD_FOLDER + photoName;
            //显示地址；
            let showUrl = domain + PHOTOS_UPLOAD_FOLDER + photoName;
            console.log("newPath",newPath);
            fs.renameSync(files.fulAvatar.path, newPath);  //重命名
            photosHandler.addIntoAPhotoTable(res.locals.user.userName,photoName,PHOTOS_UPLOAD_FOLDER + photoName);
            res.json({
                "newPath":showUrl
            });
        }
    });

});

module.exports = router;