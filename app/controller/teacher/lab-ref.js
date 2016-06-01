// 更新实验引用关系
var LabRef = require('../../models/lab').LabRef;
var LabItem = require('../../models/lab').LabItem;
var LabPost = require('../../models/lab-post').LabPost;
var LabDetail = require('../../models/lab').LabDetail;
// 异步任务
var async = require("async");

module.exports.createLabRef = function(res, labItem) {
    // 初始化 LabRef collections
    var labRef = new LabRef();
    labRef.expItemId = labItem.expItemId;
    labRef.createdByName = labItem.createdByName;
    labRef.isPublic = labItem.isPublic;
    labRef.labName = labItem.name;
    labRef.refName = new Array({
        name: labItem.createdByName,
        number: labItem.createdByNumber
    });
    labRef.save(function(err) {
        if (err) {
            console.error("实验引用创建失败:\n", err);
            // 如果实验引用创建失败, 删除新建的实验列表, 实验详情
            var query = { expItemId: labItem.expItemId };
            LabItem.remove(query).exec();
            LabDetail.remove(query).exec();
            return res.status(404).json({
                success: false,
                message: err
            });
        } else {
            // 实验引用创建成功
            // 返回实验项目
            return res.status(200).json({
                success: true,
                labItem: labItem
            });
        }
    });
};

module.exports.updateLabRef = function(res, labItem) {
    var query = { "expItemId": labItem.expItemId };
    var update = { "isPublic": labItem.isPublic };
    var options = { new: true };
    LabRef.findOneAndUpdate(query, update, options, function(err, labRef) {
        if (err) {
            return res.status(404).json({
                success: true,
                message: "实验引用修改失败"
            });
        } else {
            console.info("修改后的引用:\n", labRef);
            return res.status(200).json({
                success: true,
                message: "实验引用修改成功"
            });
        }
    });
};

// 获取实验引用列表
module.exports.getLabRef = function(req, res) {
    var query = {
        "expItemId": req.params.expItemId
    };
    // 选择数据库返回的字段(或不返回的字段, 0: 不返回, 1: 返回)
    var projection = {
        "_id": 0,
        "__v": 0
    };
    LabRef.findOne(query, projection, function(err, labRef) {
        if (err) {
            return res.status(404).json({
                success: false,
                message: "实验引用列表查找失败"
            });
        }
        return res.status(200).json({
            success: true,
            labRef: labRef
        });
    });
};

// 引用实验后, 建立与该实验的引用
module.exports.createRefName = function(req, res) {
    // 查询条件
    var query = {
        "expItemId": req.body.expItemId,
        "refName.number": {
            $ne: req.decoded.number
        }
    };
    // 要添加的老师 object
    var teacherObj = {
        name: req.decoded.name,
        number: req.decoded.number
    };
    LabRef.findOne(query, function(err, labRef) {
        if (err) {
            return res.status(404).json({
                success: false,
                message: "实验引用列表查找失败"
            });
        }
        if (labRef != null) {
            labRef.refName.push(teacherObj);
            // 更新的内容
            var update = {
                refName: labRef.refName,
                refLength: labRef.refLength + 1
            };
            var options = { new: true };
            labRef.update(update, options, function(err, newLabRef) {
                if (err) {
                    return res.status(404).json({
                        success: false,
                        message: "实验引用更新失败"
                    });
                }

                if (newLabRef != null) {
                    return res.status(200).json({
                        success: true,
                        hasRefed: true
                    });
                } else {
                    return res.status(404).json({
                        success: false,
                        message: "引用列表更新失败"
                    });
                }
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "该引用已经存在引用列表中"
            });
        }
    });
};

// 解除该实验的引用
module.exports.deleteRefName = function(req, res) {
    // 删除钱要确保没有学生选择该实验
    var query = {
        'expItemId': req.params.expItemId,
        'teacherNumber': req.decoded.number
    };
    LabPost.findOne(query, function(err, labPost) {
        if (err) {
            return res.status(404).json({
                success: false,
                message: "实验选择表查询失败"
            });
        }
        // 没有学生选择该老师的这个实验
        if (labPost === null) {
            // 查询条件
            query = {
                'expItemId': req.params.expItemId,
                'refName.number': req.decoded.number
            };
            LabRef.findOne(query, function(err, labRef) {
                if (err) {
                    return res.status(404).json({
                        success: false,
                        message: "查询实验引用失败"
                    });
                }
                if (labRef != null) {
                    var teacherNumber = req.decoded.number;
                    for (var i = 1, len = labRef.refName.length; i < len; i++) {
                        if (labRef.refName[i].number === teacherNumber) {
                            labRef.refName.splice(i, 1);
                            break;
                        }
                    }
                    // 要更新的refName
                    var update = {
                        refName: labRef.refName,
                        refLength: labRef.refLength - 1
                    };
                    var options = { new: true };
                    labRef.update(update, options, function(err, newLabRef) {
                        if (err) {
                            return res.status(404).json({
                                success: false,
                                message: "删除引用失败"
                            });
                        }
                        if (newLabRef != null) {
                            return res.status(200).json({
                                success: true,
                                hasDisRefed: true
                            });
                        } else {
                            return res.status(404).json({
                                success: false,
                                message: "引用删除失败"
                            });
                        }
                    });
                } else {
                    return res.status(404).json({
                        success: false,
                        message: "引用列表中不存在该引用"
                    });
                }
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "有学生已选择该实验, 您无法删除"
            });
        }
    });


};

// 查询某位老师是否引用了某实验
module.exports.hasRefedLab = function(req, res) {
    // 查询条件
    var expItemId = req.params.expItemId;
    var query = {
        'expItemId': expItemId,
        'refName.number': req.decoded.number
    };
    LabRef.findOne(query, function(err, labRef) {
        if (err) {
            return res.status(404).json({
                success: false,
                message: "查询实验引用失败"
            });
        }
        return res.status(200).json({
            success: true,
            hasRefed: (labRef != null)
        });
    });
};


