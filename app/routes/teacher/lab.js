// 教师路由 -- 创建实验列表, 更新实验列表, 获取实验列表
var express = require('express');
var router = express.Router();
var multer = require('multer');
var config = require('../../config/config.js'); // load the config
var lab = require('../../controller/teacher/lab-item');
var labDetail = require('../../controller/teacher/lab-detail');
var labPost = require('../../controller/public/lab-select');
var randomstring = require("randomstring");

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '.' + config.imgItemPath);
    },
    filename: function(req, file, cb) {
        cb(null, randomstring.generate({
            length: 7
        }) + Date.now() + '.' + file.mimetype.split('/')[1]);
    }
});
var upload = multer({ storage: storage });

// 创建新的实验列表
router.post('/create-item', upload.single('image'), lab.createLabItem);
// 更新实验列表
router.put('/update-item', upload.single('image'), lab.updateLabItem);
// 获取实验列表
router.get('/:category/get-items', lab.getLabItemList);
// 创建实验详情
router.post('/create-detail', labDetail.createLabDetail);
// 更新实验详情
router.put('/update-detail', labDetail.updateLabDetail);
// 获取实验详情
router.get('/get-detail/:expItemId', labDetail.getLabDetail);
// 提交实验分数
router.put('/mark-lab', labPost.postScore);
// 获取选择该老师实验的学生
router.get('/get-choosed-lab', labPost.getChooedLab);

module.exports = router;
