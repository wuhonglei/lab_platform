// 教师路由 -- 保存学生信息, 修改, 删除
var express = require('express');
var router = express.Router();
var studentInfo = require('../../controller/teacher/student-info');
var LabDetail = require('../../controller/teacher/lab-detail');

// 保存excel导入的学生信息
router.post('/upload-student-info', studentInfo.save);
// 获取班级信息列表
router.get('/get-student-info', studentInfo.getInfoList);
// 获取筛选列表(开课学期, 课程, 班级)
router.get('/get-select-list', studentInfo.getSelectedList);
// 实验详情页面, 给班级学生布置实验作业
router.post('/post-multi-work', LabDetail.postMultiWork);
// 删除班级信息
router.post('/delete-class-info', studentInfo.deleteClass);
 
module.exports = router;
