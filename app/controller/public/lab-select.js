// 学生界面 -- 选择实验函数
var fs = require('fs');
var LabPost = require('../../models/lab-post').LabPost;
var LabRequest = require('./lab-requst-params');
var pdfPath = require('../../config/config').pdfPath;

// 创建学生所选实验列表
module.exports.chooseLab = function(req, res) {
    // 获取请求的参数
    // 确认是本人发送的选择实验请求
    if (req.body.studentNumber === req.decoded.number) {
        var labPost = LabRequest.get(req);
        labPost.save(function(err) {
            if (err) {
                console.error("学生实验选择失败(学生表):\n", err);
                return res.status(404).json({
                    success: false,
                    message: "实验选择失败"
                });
            } else {
                // ===========================================//
                return res.status(200).json({
                    success: true,
                    message: "实验选择成功"
                });
            }
        });
    } else {
        return res.status(401).json({
            success: false,
            message: "你无权选择"
        });
    }
};

// 学生上传PDF, 后者老师上传成绩
module.exports.postScore = module.exports.postPdf = function(req, res) {
    // 获取请求的参数
    if (!req.decoded.isTeacher && req.file.mimetype != 'application/pdf') {
        return res.status(404).json({
            success: false,
            message: "提交的文件类型有误"
        });
    }
    // 数据库查询条件
    var query = {
        "expItemId": req.body.expItemId,
        "studentNumber": req.body.studentNumber
    };
    // 获取要更新的条目
    var update = LabRequest.get(req, true);
    // 返回修改成功后的document
    var options = { new: false };
    LabPost.findOneAndUpdate(query, update, options, function(err, labPost) {
        if (err) {
            return res.status(404).json({
                success: false,
                message: "修改失败"
            });
        }
        res.status(200).json({
            success: true,
            update: update
        });
        if (!req.decoded.isTeacher && labPost.workUrl) {
            // 学生上传PDF后, 删除之前的PDF
            var path = '.' + pdfPath + '/' + labPost.workUrl;
            fs.unlink(path, function(err) {
                return;
            });
        }
    });
};

// 获取选择的实验
module.exports.getChooedLab = function(req, res) {
    var query = req.decoded.isTeacher ? { teacherNumber: req.decoded.number } : { studentNumber: req.decoded.number };
    // 选择数据库返回的字段(或不返回的字段, 0: 不返回, 1: 返回)
    var projection = {
        "_id": 0,
        "__v": 0
    };
    // 按照修改时间排序: 降序
    var options = {
        sort: {
            // 1 是升序, -1 是降序
            "choosedDate": 1
        }
    };
    LabPost.find(query, projection, options, function(err, labPost) {
        if (err) {
            return res.status(404).json({
                success: false,
                message: "查询失败"
            });
        }
        return res.status(200).json({
            success: true,
            labPost: labPost
        });
    });
};
