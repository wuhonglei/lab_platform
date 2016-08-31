// 学生路由 -- 获取实验列表
var LabItem = require('../../models/lab').LabItem;
var LabDetail = require('../../models/lab').LabDetail;
var LabPost = require('../../models/lab-post').LabPost;

// 获取学生选择的实验列表
var getLabs = function(req, res, query) {
    // 选择数据库返回的字段(或不返回的字段, 0: 不返回, 1: 返回)
    var projection = {
        "_id": 0,
        "__v": 0,
        "isPublic": 0
    };
    // 按照修改时间排序: 降序
    var options = {
        limit: +req.query.limit,
        skip: (+req.query.pageNumber - 1) * (+req.query.limit),
        sort: {
            // 1 是升序, -1 是降序
            "modifiedDate": -1
        }
    };
    console.log('options = ', options);
    LabItem.find(query, projection, options, function(err, labItems) {
        if (err) {
            return res.status(404).json({
                success: false,
                message: "实验列表获取失败"
            });
        } else {
            LabItem.count(query).exec(function(err, count) {
                if (err) {
                    return res.status(404).json({
                        success: false,
                        message: "实验列表获取失败"
                    });
                }
                return res.status(200).json({
                    success: true,
                    count: count,
                    labItems: labItems
                });
            });
        }
    });
};

// 获取老师创建的实验列表
module.exports.getLabItemList = function(req, res) {
    // 查询条件
    var query = {
        labCategory: req.params.category
    };
    getLabs(req, res, query);
};

// 获取某实验的详情
module.exports.getLabDetail = function(req, res) {
    // 查询条件
    var query = {
        expItemId: req.params.expItemId
    };
    // 选择数据库返回的字段(或不返回的字段, 0: 不返回, 1: 返回)
    var projection = {
        "_id": 0,
        "__v": 0,
        "isPublic": 0,
        "labCategory": 0
    };

    LabDetail.findOne(query, projection, function(err, labDetail) {
        if (err) {
            return res.status(404).json({
                success: false,
                message: "实验列表获取失败"
            });
        } else {
            return res.status(200).json({
                success: true,
                labDetail: labDetail
            });
        }
    });
};

// 查询某学生是否选择了具体某个实验
module.exports.hasChoosedLab = function(req, res) {
    // 查询条件
    var query = {
        expItemId: req.params.expItemId,
        studentNumber: req.decoded.number
    };
    // 选择数据库返回的字段(或不返回的字段, 0: 不返回, 1: 返回)
    var projection = {
        "teacherName": 1
    };

    LabPost.findOne(query, projection, function(err, labPost) {
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

// 查询某学生选择的所有实验列表
module.exports.getPersonalLabs = function(req, res) {
    // 查询条件
    var query = { studentNumber: req.decoded.number };
    // 选择数据库返回的字段(或不返回的字段, 0: 不返回, 1: 返回)
    var projection = {
        'expItemId': 1,
        '_id': 0
    };
    LabPost.find(query, projection, function(err, expItemIds) {
        if (err) {
            return res.status(404).json({
                success: false,
                message: "学生实验选择表查询失败"
            });
        }
        var expItemIdArray = [];
        expItemIds.forEach(function(element, index) {
            expItemIdArray.push(element.expItemId);
        });
        if (expItemIdArray.length != 0) {
            // 查询条件
            query = {
                expItemId: { $in: expItemIdArray }
            };
            // 获取实验列表
            getLabs(req, res, query);
        } else {
            return res.status(200).json({
                success: true,
                labItems: []
            })
        }
    });
};
