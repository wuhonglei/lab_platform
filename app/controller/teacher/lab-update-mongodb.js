// 这个js文件是用来给mongodb中的实验详情添加实验名称
var LabDetail = require('../../models/lab').LabDetail;
var LabItem = require('../../models/lab').LabItem;
var LabRef = require('../../models/lab').LabRef;
var async = require('async');
console.log("自动执行");

// 给实验详情中新增labName属性
module.exports.addLabDetailName = function() {
    var query = {};
    LabItem.find(query, function(err, doc) {
        if (err) {
            return;
        }
        console.log('查询成功');
        var items = [];
        var length = doc.length;
        var obj;
        // 将实验列表中expItemID, name保存到数组中
        for (var i = 0; i < length; i++) {
            obj = {
                expItemId: doc[i].expItemId,
                labName: doc[i].name
            };
            items.push(obj);
        }
        async.each(items, function(item, callback) {
            // 
            LabDetail.update({ expItemId: item.expItemId }, { $set: item }, function(err, num) {
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        }, function(err) {
            if (err) {
                return;
            }
            console.log('实验列表更新成功');
        });
    });
};

// 改变实验详情or列表中 createdByNumber 类型, 由Number改为String类型
module.exports.changeLabDetailNumberType = function() {
    var query = {};
    var update = {
        "refName.0": {
            "name": "管理员",
            "number": "154611110"
        }
    };
    var option = {
        multi: true
    };
    // or LabDetail
    LabRef.update(query, { $set: update }, option, function(err, num) {
        if (err) {
            console.log('类型变更失败', err);
            return;
        }
        console.log('num = ', num);
    });
};
