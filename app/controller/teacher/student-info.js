// 对学生信息的增删改查(MongoDB CRUD)
var StudentInfo = require('../../models/student-info').StudentInfo;
var InfoList = require('../../models/student-info').InfoList;
var async = require('async');

// 保存学生信息表
module.exports.save = function(req, res) {
    // 查询studentInfo数据库中是否存在 ××课程 ××班级
    var classLists = req.body.data;
    var infoList = req.body.infoList;
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
            return res.status(500).json({
                success: false,
                description: err.description,
                message: err.message
            });
        }
        var infoListTmp = infoList;
        InfoList.findOne({ number: req.decoded.number }, function(err, result) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    description: "",
                    message: err.message
                });
            }
            // 数据库为空
            if (result === null) {
                infoListTmp.number = req.decoded.number;
                var infoList = new InfoList(infoListTmp);
                var keys = ["years", "courses", "classes", "descriptions"];
                var len = keys.length;
                for (var i = 0; i < len; i++) {
                    infoList[keys[i]] = uniq(infoList[keys[i]]);
                }
                infoList.save(function(err) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            description: "",
                            message: err.message
                        });
                    }
                    return res.status(200).json({
                        success: true
                    });
                });
            } else {
                var updatedDoc = {};
                for (var key in infoListTmp) {
                    updatedDoc[key] = result[key].concat(infoListTmp[key]);
                    // 去除数组中重复的项目
                    updatedDoc[key] = uniq(updatedDoc[key]);
                }
                result.update({ $set: updatedDoc }).exec();
                return res.status(200).json({
                    success: true
                });
            }
        });
    });
};

// 获取教师的学生信息表
module.exports.getInfoList = function(req, res) {
    var query = {
        number: req.decoded.number
    };
    var projection = {};
    var option = {
        sort: {
            "_id": -1
        }
    };
    StudentInfo.find(query, projection, option, function(err, infoLists) {
        if (err) {
            return res.json(500).json({
                success: false,
                message: '查询失败'
            });
        }
        if (infoLists.length > 0) {
            return res.status(200).json({
                success: true,
                infoLists: infoLists,
                message: '学生信息获取成功'
            });
        } else {
            return res.status(200).json({
                success: true,
                infoLists: [],
                message: '学生信息获取成功'
            });
        }
    });
};

// 获取过滤条目 开课学期, 课程名, 班级
module.exports.getSelectedList = function(req, res) {
    var query = { number: req.decoded.number };
    InfoList.findOne(query, function(err, doc) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
        return res.status(200).json({
            success: true,
            infoList: doc
        });
    })
}

// 去除数组中重复的元素
function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
}
