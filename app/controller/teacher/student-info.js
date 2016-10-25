// 对学生信息的增删改查(MongoDB CRUD)
var StudentInfo = require('../../models/student-info').StudentInfo;
var InfoList = require('../../models/student-info').InfoList;
var async = require('async');

// 遍历对象属性
var iterateObj = function(objName) {
    if (typeof objName != 'object') {
        console.error("请输入对象");
        return;
    }
    for (var key in objName) {
        console.log('Object.' + key + ": ", objName[key]);
    }
};

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
                // var keys = ["years", "courses", "classes", "descriptions"];
                // var len = keys.length;
                // for (var i = 0; i < len; i++) {
                //     infoList[keys[i]] = uniq(infoList[keys[i]]);
                // }
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
                    // updatedDoc[key] = uniq(updatedDoc[key]);
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
    var selected = JSON.parse(req.params.selected);
    selected.number = req.decoded.number;
    var query = selected;
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
        if (err || doc == null) {
            return res.status(500).json({
                success: false
            });
        }
        // var keys = ["years", "courses", "classes", "descriptions"];
        var resDoc = {
            "years": undefined,
            "courses": undefined,
            "classes": undefined,
            "descriptions": undefined
        };
        // 去除数组中重复的元素
        for (var key in resDoc) {
            resDoc[key] = uniq(doc[key]);
        }
        return res.status(200).json({
            success: true,
            infoList: resDoc
        });
    })
}

// 删除某个班级信息
module.exports.deleteClass = function(req, res) {
    var description = req.body.description;
    var query = {
        description: description
    };
    StudentInfo.findOneAndRemove(query, function(err, doc) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
        var query = {
            descriptions: description
        };
        InfoList.findOne(query, function(err, doc) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }
            var updateDoc = {
                "years": undefined,
                "courses": undefined,
                "classes": undefined,
                "descriptions": undefined
            };
            var index = doc.descriptions.indexOf(description);
            if (index == -1) {
                return res.status(500).json({
                    success: false,
                    message: "删除失败"
                });
            }
            // 删除筛选列表中与班级相关的信息(开课日期, 课程名, 班级名)
            for (var key in updateDoc) {
                updateDoc[key] = doc[key];
                updateDoc[key].splice(index, 1);
            }
            doc.update({ $set: updateDoc }, function(err) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err.message
                    });
                }
                return res.status(202).json({
                    success: true,
                    message: "删除成功"
                });
            });
        });
    });
};

// 去除数组中重复的元素
function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    });
}
