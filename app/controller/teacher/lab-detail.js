// 实验详情函数 
var mongoose = require('mongoose');
var LabDetail = require('../../models/lab').LabDetail;
var Lab = require('../../models/lab');
var LabRef = require('./lab-ref');
var LabPost = require('../../models/lab-post').LabPost;
var LabPublishedList = require('../../models/lab-post').LabPublishedList;
var LabChoosedByStu = require('../../models/lab-post').LabChoosedByStu;
var StudentInfo = require('../../models/student-info').StudentInfo;
var async = require('async');

// 创建实验详情列表
module.exports.createLabDetail = function(res, labItem) {
    var labDetail = new LabDetail({
        expItemId: labItem.expItemId,
        labName: labItem.name,
        createdByName: labItem.createdByName,
        createdByNumber: labItem.createdByNumber,
        expDetailId: new mongoose.Types.ObjectId,
        labDetail: "",
        labCategory: labItem.labCategory
    });
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
        number: req.decoded.number,
        expItemId: req.body.expItemId,
        description: req.body.description
    };
    LabPublishedList.findOne(query, function(err, doc) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
        // 如果已经给该班级学生布置了这个实验
        if (doc != null) {
            console.log('实验详情页面已经存在');
            return res.status(200).json({
                success: false,
                labName: req.body.labName,
                message: "已存在"
            });
        }
        // 没有给该班级学生布置过该实验
        StudentInfo.findOne({ description: req.body.description }, function(err, oneStudentInfo) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "无匹配的学生信息"
                });
            }
            // 存放一个班级学生的学号, 姓名
            var info = oneStudentInfo.info;
            // 存放学生所在的班级, 课程名, 开课学期
            var otherInfo = {
                className: oneStudentInfo.class,
                course: oneStudentInfo.course,
                year: oneStudentInfo.year
            };
            // 批量进行学生选择实验操作
            createMultiLabPost(req.body, res, info, otherInfo);
        });
    });
};

// 将学生和实验进行关联
function createMultiLabPost(request, res, data, otherInfo) {
    // 两周总的毫秒数
    var length = data.length;
    var labPostCol = [];
    var options = {
        upsert: true,
        multi: false
    };
    for (var i = 0; i < length; i++) {
        labPostCol.push(labPostFn(request, data[i], otherInfo));
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
        // 创建学生成绩筛选列表
        var update = {
            $set: { number: request.number },
            $addToSet: {
                classes: otherInfo.className,
                courses: otherInfo.course,
                years: otherInfo.year,
                expItemIds: request.expItemId,
                labNames: request.labName,
                labCategory: request.labCategory
            }
        };
        var option = {
            upsert: true
        };
        // 成绩打分页面的筛选列表内容
        LabChoosedByStu.update({ number: request.number }, update, option, function(err, num) {
            if (err) {
                console.log('LabChoosedByStu', err.message);
                return res.status(500).json({
                    success: false,
                    message: "创建失败"
                });
            }

            var doc = {
                number: request.number,
                expItemId: request.expItemId,
                description: request.description,
                labName: request.labName,
                labCategory: request.labCategory,
                class: otherInfo.className,
                course: otherInfo.course,
                year: otherInfo.year,
                deadline: new Date(Date.now() + request.deadline)
            };
            var labPublishedList = new LabPublishedList(doc);
            labPublishedList.save();
            return res.status(200).json({
                success: true,
                message: "创建成功"
            });
        });

    });
};

// 创建labpost document
function labPostFn(request, student, otherInfo) {
    var data = request;
    var labObj = {
        expItemId: data.expItemId,
        labCategory: data.labCategory,
        labName: data.labName,
        studentName: student.name,
        studentNumber: student.number,
        teacherName: data.name,
        teacherNumber: data.number,
        className: otherInfo.className,
        course: otherInfo.course,
        year: otherInfo.year,
        deadline: new Date(Date.now() + data.deadline)
    };
    // var labPost = new LabPost(labObj);
    return labObj;
}
