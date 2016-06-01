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

// 查询即将被删除的实验中, 是否有实验被其他老师引用
module.exports.deleteLabs = function(req, res) {
    /*
        1. 根据 expItemId, 查询LabPost, LabRef表
        2. 根据 1 中查询的结果来决定是否删除 LabItem, LabRef, LabDetail表
    */
    // 请求删除的expItemId数组
    var expItemIdArray = JSON.parse(req.params.expItemIdArray);
    // 被其他老师引用的实验下标
    var beenRefed = [];
    // 被其他学生选择
    var beenChoosed = [];
    // 存放成功删除的实验下标
    var hasDeleted = [];
    // 删除失败
    var errorDeleted = [];
    // 遍历 expItemIdArray 数组, 并删除允许删除的 实验
    async.each(expItemIdArray, function(expItemIdObj, callbackEnd) {
        var asyncSearchTasks = [];
        // 查询LabRef表的条件
        var queryLabRef = {
            'expItemId': expItemIdObj.expItemId,
            'refName.number': req.decoded.number,
            'refLength': { $gte: 1 }
        };
        // 查询LabPost表的条件
        var queryLabPost = {
            'expItemId': expItemIdObj.expItemId,
            'teacherNumber': req.decoded.number
        };
        // 查询 LabRef collection
        asyncSearchTasks.push(function(callback) {
            // 如果LabRef collection 中能找到非空的labRef document
            // 说明: 该实验已经被其他老师引用 
            LabRef.findOne(queryLabRef, function(err, labRef) {
                if (err) {
                    return callback(!null, false);
                }
                if (labRef === null) {
                    // 该实验没有被其他老师引用
                    callback(null, true);
                } else {
                    beenRefed.push(expItemIdObj.index);
                    callback(null, false);
                }
            });
        });
        // 查询 LabPost collection
        asyncSearchTasks.push(function(callback) {
            // 如果LabRef collection 中能找到非空的labRef document
            // 说明: 该实验已经被其他老师引用 
            LabPost.findOne(queryLabPost, function(err, labPost) {
                if (err) {
                    return callback(!null, false);
                }
                if (labPost === null) {
                    // 该实验没有被其他学生选择
                    callback(null, true);
                } else {
                    beenChoosed.push(expItemIdObj.index);
                    callback(null, false);
                }
            });
        });

        // 执行异步任务集合
        async.parallel(asyncSearchTasks, function(err, result) {
            if (err) {
                return;
            }
            if (result[0] && result[1]) {
                // 实验既没有被老师引用, 也没有被学生选择, 该实验允许被删除
                // 存放执行异步操作的数组
                // 依次删除实验详情, 实验引用, 实验列表 document
                LabDetail.remove({ expItemId: expItemIdObj.expItemId }).exec();
                LabRef.remove({ expItemId: expItemIdObj.expItemId }).exec();
                LabItem.remove({ expItemId: expItemIdObj.expItemId }).exec();
                hasDeleted.push(expItemIdObj.index);
                callbackEnd(null);
            } else {
                callbackEnd(null);
            }
        });
    }, function(err) {
        if (err) {
            return res.status(404).json({
                success: false,
                message: "删除失败"
            });
        }
        return res.status(200).json({
            success: true,
            hasDeleted: hasDeleted,
            beenChoosed: beenChoosed,
            beenRefed: beenRefed
        });
    });
};
