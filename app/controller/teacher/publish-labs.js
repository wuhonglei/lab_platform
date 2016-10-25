// 给班级布置实验(一个或多个)
var mongoose = require('mongoose');
var LabPost = require('../../models/lab-post').LabPost;
var LabPublishedList = require('../../models/lab-post').LabPublishedList;
var LabChoosedByStu = require('../../models/lab-post').LabChoosedByStu;
var StudentInfo = require('../../models/student-info').StudentInfo;
var async = require('async');

module.exports.publishMutilLabs = function(req, res) {
    var labItems = req.body.postData;
    async.each(labItems, function(labItem, callback) {
        var queryHasBeenPUblished = {
            number: labItem.number,
            expItemId: labItem.expItemId,
            description: labItem.description
        };
        // 查询实验是否已经布置给班级
        LabPublishedList.findOne(queryHasBeenPUblished, function(err, doc) {
            if (err) {
                return callback(err);
            }
            if (doc != null) {
                var message = labItem.labName + "已经布置过!"
                return callback(message);
            }
            /*-----------实验之前没有布置给该班级, 给班级每个学生创建与该实验的关联----------*/
            var queryStudentInfo = {
                description: labItem.description
            };
            StudentInfo.findOne(queryStudentInfo, function(err, classInfo) {
                if (err) {
                    return callback(err);
                }
                // 一个班级中所有学生的信息(学号, 姓名)
                var students = classInfo.info;
                var commanInfo = {
                    className: classInfo.class,
                    course: classInfo.course,
                    year: classInfo.year
                };

                var studentCounts = students.length;
                var labPosts = createLabPosts(labItem, students, commanInfo);
                var options = {
                    upsert: true,
                    multi: false
                };
                async.each(labPosts, function(labPost, callbackInner) {
                    // 保存到 学生实验选择表中
                    LabPost.update(labPost, { $set: labPost }, options, function(err) {
                        if (err) {
                            return callbackInner(err);
                        }
                        return callbackInner(null);
                    }, function(err) {
                        if (err) {
                            return callback(err);
                        }

                        /*
                         1. 创建成绩打分界面的筛选表 LabChoosedByStu
                         2. 创建已布置实验列表 LabPublishedList
                        */
                        var asyncSearchTasks = [];
                        asyncSearchTasks.push(function(callbackParallel) {
                            var update = {
                                $set: { number: labItem.number },
                                $addToSet: {
                                    classes: commanInfo.className,
                                    courses: commanInfo.course,
                                    years: commanInfo.year,
                                    expItemIds: labItem.expItemId,
                                    labNames: labItem.labName,
                                    labCategory: labItem.labCategory
                                }
                            };
                            var option = {
                                upsert: true
                            };
                            LabChoosedByStu.update({ number: labItem.number }, update, option, function(err) {
                                if (err) {
                                    return callbackParallel(err);
                                }
                                callbackParallel(null, true);
                            });
                        });
                        asyncSearchTasks.push(function(callbackParallel) {
                            var labPublished = {
                                number: labItem.number,
                                expItemId: labItem.expItemId,
                                description: labItem.description,
                                labName: labItem.labName,
                                labCategory: labItem.labCategory,
                                class: commanInfo.className,
                                course: commanInfo.course,
                                year: commanInfo.year,
                                deadline: new Date(Date.now() + labItem.deadline)
                            };
                            var labPublishedList = new LabPublishedList(labPublished);
                            labPublishedList.save(function(err) {
                                if (err) {
                                    return callbackParallel(err);
                                }
                                return callbackParallel(null, true);
                            });
                        });
                        async.parallel(asyncSearchTasks, function(err, result) {
                            if (err) {
                                return callback(err);
                            }
                            if (result[0] && result[1]) {
                                return callback(null);
                            }
                        });
                    });
                }, function(err) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err
                        });
                    }
                    return res.status(200).json({
                        success: true,
                        message: "执行成功"
                    });
                });
            });

        });
    });
};


// 创建labPost documents
function createLabPosts(labItem, students, commanInfo) {
    var length = students.length;
    var labPosts = [];
    for (var i = 0; i < length; i++) {
        var labPost = {
            expItemId: labItem.expItemId,
            labCategory: labItem.labCategory,
            labName: labItem.labName,
            studentName: student[i].name,
            studentNumber: student[i].number,
            teacherName: labItem.name,
            teacherNumber: labItem.number,
            className: commanInfo.className,
            course: commanInfo.course,
            year: commanInfo.year,
            deadline: new Date(Date.now() + labItem.deadline)
        };
    }
    return labPosts;
}
