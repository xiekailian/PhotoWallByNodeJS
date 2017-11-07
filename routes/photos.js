var express = require('express');
var router = express.Router();
var usersHandler = require('../logic/usersHandler');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.route("/myPhotos").get(function (req, res) {
    res.render('photos', { title: 'Photos' });
}).post(function (req, res) {

});

module.exports = router;