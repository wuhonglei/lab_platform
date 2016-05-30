// 实验列表函数 
var LabItem = require('../../models/lab').LabItem;
var LabRef = require('./lab-ref');
var LabDetail = require('./lab-detail');
var LabRequest = require('./lab-request-params');

// 创建实验列表 
module.exports.createLabItem = function(req, res) {
    // 获取请求的参数    
    // (实验类别, 实验名称, 实验描述, 实验缩略图url, 实验创建者, 实验创建者教工号, 实验是否公开)
    req.body.thumbnail = req.file.filename;
    var labItem = LabRequest.getLabItem(req);
    // 保存到实验列表项目 LabItem collections中
    labItem.save(function(err) {
        if (err) {
            console.error("实验列表创建失败:\n", err);
            return res.status(404).json({
                success: false,
                message: "实验列表创建失败"
            });
        } else {
            //=====================================//
            // 创建实验详情
            LabDetail.createLabDetail(res, labItem);
        }
    });
 
};

// 更新实验列表
module.exports.updateLabItem = function(req, res) {
    if (req.body.createdByNumber != req.decoded.number) {
        return res.status(401).json({
            success: false,
            message: "你无权修改此实验条目"
        });
    } else {
        var query = { "expItemId": req.body.expItemId };
        var update = LabRequest.getLabItem(req, true);
        // 返回修改后的document
        var options = { new: true };
        LabItem.findOneAndUpdate(query, update, options, function(err, labItem) {
            if (err) {
                return res.status(404).json({
                    success: false,
                    message: "实验列表更新失败"
                });
            } else {
                //   更新实验引用表
                if (req.body.isPublic != undefined) {
                    // isPublic 被改变后, 更新实验引用表中 isPublic 的值
                    LabRef.updateLabRef(res, labItem);
                } else {
                    return res.status(200).json({
                        success: true,
                        labItem: update
                    });
                }
            }
        });
    }
};

// 获取实验列表
module.exports.getLabItemList = function(req, res) {
    // 查询条件
    var query = {
        labCategory: req.params.category,
        $or: [{
            isPublic: true,
            createdByNumber: { $ne: req.decoded.number }
        }, {
            createdByNumber: req.decoded.number
        }]
    };
    // 选择数据库返回的字段(或不返回的字段, 0: 不返回, 1: 返回)
    var projection = {
        "_id": 0,
        "__v": 0
    };
    // 按照修改时间排序: 降序
    var options = {
        sort: {
            // 1 是升序, -1 是降序
            "modifiedDate": -1
        }
    };
    LabItem.find(query, projection, options, function(err, labItems) {
        if (err) {
            return res.status(404).json({
                success: false,
                message: "实验列表获取失败"
            });
        } else {
            return res.status(200).json({
                success: true,
                labItems: labItems
            });
        }
    });
};
