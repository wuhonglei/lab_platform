// 对学生信息的增删改查(MongoDB CRUD)
var StudentInfo = require('../../models/student-info.js');
var async = require('async');

// 保存学生信息表
module.exports.save = function(req, res) {
    // 查询studentInfo数据库中是否存在 ××课程 ××班级
    var classLists = req.body;
    async.each(classLists, function(item, callback) {
        /* body... */
        var studentInfo = new StudentInfo();
        // key代表对象中的属性, 而不是属性值
        for (var key in item) {
            studentInfo[key] = item[key];
        }
        studentInfo.number = req.decoded.number;
        // 保存到数据库
        studentInfo.save(function(err, updatedInfo) {
            if (err) {
                // return callback(err, result)
                return callback({
                    description: item.description,
                    message: err
                });
            } else {
                return callback(null, updatedInfo)
            };
        });
    }, function(err) {
        if (err) {
            return res.status(403).json({
                success: false,
                description: err.description,
                message: err.message
            });
        }
        return res.status(200).json({
            success: true
        });
    });
};
