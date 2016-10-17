// 学生界面 -- 学生选择实验后需要创建, 修改, 获取实验作业表
var LabPost = require('../../models/lab-post').LabPost;
var mongoose = require('mongoose');

// 保存或更新学生所选实验作业列表项
module.exports.get = function(req, isUpdate) {
    var labPostReq = ["expItemId", "labName", "teacherName", "teacherNumber"];

    var labPost = isUpdate ? {} : new LabPost();
    for (var i = 0; i < labPostReq.length; i++) {
        if (req.body[labPostReq[i]] != undefined) {
            labPost[labPostReq[i]] = req.body[labPostReq[i]];
        }
    } 
    if (!isUpdate) {
        labPost.studentName = req.body.studentName;
        labPost.studentNumber = req.body.studentNumber;
    } else {
        if (req.decoded.isTeacher) {
            // 修改人是老师
            labPost.isMarked = true;
            labPost.score = req.body.score;
        } else {
            // 修改人是学生
            labPost.isPost = true;
            labPost.postDate = Date.now();
            labPost.workUrl = req.file.filename;
        }
    }

    return labPost;
};
