// 教师路由 -- 创建实验列表, 更新实验列表, 获取实验列表
var express = require('express');
var router = express.Router();
var multer = require('multer');
var config = require('../../config/config.js'); // load the config
var lab = require('../../controller/teacher/lab-item');
var labRef = require('../../controller/teacher/lab-ref');
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
// 获取个人实验列表(学生: 学生选择的实验; 老师: 老师创建的实验, 或自己引用的实验);
router.get('/get-personal-labs', lab.getPersonalLab);
 
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

// 新增实验引用列表中的refName条目
router.put('/createRefName', labRef.createRefName);
// 删除实验引用列表中的refName条目
router.delete('/deleteRefName/:expItemId', labRef.deleteRefName);
// 查询某位老师是否引用了某实验
router.get('/has-reffed-lab/:expItemId', labRef.hasRefedLab);

// 查询一组实验中是否有实验被其他老师引用
router.delete('/delete-labs/:expItemIdArray', lab.deleteLabs);

module.exports = router;
