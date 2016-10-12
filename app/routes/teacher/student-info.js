// 教师路由 -- 保存学生信息, 修改, 删除
var express = require('express');
var router = express.Router();
var studentInfo = require('../../controller/teacher/student-info');

// 保存excel导入的学生信息
router.post('/upload-student-info', studentInfo.save);

module.exports = router;
