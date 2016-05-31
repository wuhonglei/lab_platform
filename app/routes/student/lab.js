// 学生路由 获取实验列表
var express = require('express');
var router = express.Router();
var multer = require('multer');
var lab = require('../../controller/student/lab-item');
var labPost = require('../../controller/public/lab-select');
var labRef = require('../../controller/teacher/lab-ref');
var config = require('../../config/config');
  
var randomstring = require("randomstring");
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '.' + config.pdfPath);
    },
    filename: function(req, file, cb) {
        cb(null, randomstring.generate({
            length: 7
        }) + Date.now() + '.' + file.mimetype.split('/')[1]);
    }
});
var upload = multer({ storage: storage });
  
// 获取实验列表
router.get('/:category/get-items', lab.getLabItemList);
// 获取实验详情
router.get('/get-detail/:expItemId', lab.getLabDetail);

// 获取实验引用列表
router.get('/get-lab-ref/:expItemId', labRef.getLabRef);
// 选择实验
router.post('/choose-lab', labPost.chooseLab);
// 获取选择的实验 
router.get('/get-choosed-lab', labPost.getChooedLab);

// 提交实验报告
router.put('/post-lab-pdf', upload.single('pdf'), labPost.postPdf);

// 查询某学生是否选择了具体的某个实验
router.get('/has-choosed-this-lab/:expItemId', lab.hasChoosedLab);
module.exports = router;
