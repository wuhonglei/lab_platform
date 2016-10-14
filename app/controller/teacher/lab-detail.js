// 实验详情函数 
var mongoose = require('mongoose');
var LabDetail = require('../../models/lab').LabDetail;
var Lab = require('../../models/lab');
var LabRef = require('./lab-ref');
var LabPost = require('../../models/lab-post').LabPost;
var StudentInfo = require('../../models/student-info').StudentInfo;
var async = require('async');

// 创建实验详情列表
module.exports.createLabDetail = function(res, labItem) {
    var labDetail = new LabDetail();

    labDetail.expItemId = labItem.expItemId;
    labDetail.labName = labItem.name;
    labDetail.createdByName = labItem.createdByName;
    labDetail.createdByNumber = labItem.createdByNumber;
    labDetail.expDetailId = new mongoose.Types.ObjectId;
    labDetail.labDetail = "";
    labDetail.save(function(err) {
        if (err) {
            // 如果实验详情创建失败, 移除新建的实验列表
            var query = { expItemId: labItem.expItemId };
            console.error("实验详情创建失败:\n", err);
            Lab.LabItem.remove(query).exec();
            return res.status(500).json({
                success: false,
                message: err
            });
        } else {
            // 创建引用列表
            LabRef.createLabRef(res, labItem);
        }
    });

};

// 更新实验详情列表
module.exports.updateLabDetail = function(req, res) {
    if (req.body.createdByNumber != req.decoded.number) {
        return res.status(401).json({
            success: false,
            message: "你无权修改此实验详情"
        });
    } else {
        var query = { "expItemId": req.body.expItemId };
        var update = {
            labDetail: req.body.labDetail,
            modifiedDate: Date.now()
        };
        // 返回修改后的 document
        var options = { new: true };

        LabDetail.findOneAndUpdate(query, update, options, function(err, labDetail) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: "实验详情更新成功"
                });
            }
        });
    }
};

//  获取实验详情
module.exports.getLabDetail = function(req, res) {
    var query = { "expItemId": req.params.expItemId };
    LabDetail.findOne(query, function(err, labDetail) {
        if (err) {
            console.info("查询失败");
            return res.status(500).json({
                success: false,
                message: "实验详情获取失败"
            });
        } else {
            return res.status(200).json({
                success: true,
                labDetail: labDetail
            });
        }
    });
};

// 实验详情页面 upload image 
module.exports.uploadImage = function(req, res) {
    return res.status(200).json({
        success: true,
        image: req.file.filename
    });
};

// 实验详情页面 upload file
module.exports.uploadFile = function(req, res) {
    return res.status(200).json({
        success: true,
        file: req.file.filename
    });
};

// 实验详情页面给指定班级学生布置作业
module.exports.postMultiWork = function(req, res) {
    var query = {
        description: req.body.description
    };
    StudentInfo.findOne(query, function(err, oneStudentInfo) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "无匹配的学生信息"
            });
        }
        var info = oneStudentInfo.info;
        // 批量进行学生选择实验操作
        createMultiLabPost(req.body, res, info);
    });
};

// 将学生和实验进行关联
function createMultiLabPost(request, res, data) {
    var length = data.length;
    var labPostCol = [];
    var options = {
        upsert: true,
        multi: false
    };
    for (var i = 0; i < length; i++) {
        labPostCol.push(labPostFn(request, data[i]));
    }
    async.each(labPostCol, function(doc, callback) {
        // 保存到数据库, 如果存在则更新, 不存在则保存
        LabPost.update(doc, { $set: doc }, options, function(err) {
            if (err) {
                return callback(err);
            }
            return callback(null);
        });
    }, function(err) {
        if (err) {
            console.log('执行出错: ', err);
            return res.status(500).json({
                success: false,
                message: '实验选择失败'
            });
        }
        return res.status(200).json({
            success: true,
            message: '实验布置成功'
        });
    });
};

// 创建labpost document
function labPostFn(request, student) {
    var data = request;
    var labObj = {
        expItemId: data.expItemId,
        labName: data.labName,
        studentName: student.name,
        studentNumber: student.number,
        teacherName: data.name,
        teacherNumber: data.number
    };
    // var labPost = new LabPost(labObj);
    return labObj;
}
