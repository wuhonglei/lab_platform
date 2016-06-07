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
// 实验列表页面 缩略图
var storage1 = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '.' + config.imgItemPath);
    },
    filename: function(req, file, cb) {
        cb(null, randomstring.generate({
            length: 7
        }) + Date.now() + '.' + file.mimetype.split('/')[1]);
    }
});
// 实验详情页面 图片
var storage2 = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '.' + config.imgDetailPath);
    },
    filename: function(req, file, cb) {
        cb(null, randomstring.generate({
            length: 7
        }) + Date.now() + '.' + file.mimetype.split('/')[1]);
    }
});

// 实验详情页面 文件
var storage3 = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '.' + config.filePath);
    },
    filename: function(req, file, cb) {
        cb(null, randomstring.generate({
            length: 7
        }) + Date.now() + '.' + file.mimetype.split('/')[1]);
    }
});

var upload1 = multer({ storage: storage1 });
var upload2 = multer({ storage: storage2 });
var upload3 = multer({ storage: storage3 });

// 创建新的实验列表
router.post('/create-item', upload1.single('image'), lab.createLabItem);
// 更新实验列表
router.put('/update-item', upload1.single('image'), lab.updateLabItem);
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
// 实验详情 upload image 
router.post('/upload-image', upload2.single('image'), labDetail.uploadImage);
// 实验详情 upload file
router.post('/upload-file', upload3.single('file'), labDetail.uploadFile)

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
