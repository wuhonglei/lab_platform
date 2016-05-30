// 更新实验引用关系
var LabRef = require('../../models/lab').LabRef;
var Lab = require('../../models/lab');
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
            Lab.LabItem.remove(query).exec();
            Lab.LabDetail.remove(query).exec();
            return res.status(404).json({
                success: false,
                message: err
            });
        } else {
            // 实验引用创建成功
            console.info("实验引用创建成功");
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
    var query = { "expItemId": req.params.expItemId };
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
