// 教师界面 -- 获取请求的参数
var mongoose = require('mongoose');
var LabItem = require('../../models/lab').LabItem;
var LabMark = require('../../models/lab').LabMark;

// 保存或更新实验条目
module.exports.getLabItem = function(req, isUpdate) {
    if (req.file != undefined) {
        req.body.thumbnail = req.file.filename;
    }
    var labItemReq = ["labCategory", "name", "description", "thumbnail", "createdByName", "createdByNumber", "isPublic", "hardLevel"];
    var labItemDef = ["labCategory", "name", "description", "thumbnail", "createdByName", "createdByNumber", "isPublic", "hardLevel"];
    var labItem = isUpdate ? {} : new LabItem();
    for (var i = 0, len = labItemDef.length; i < len; i++) {
        if (req.body[labItemReq[i]] != undefined) {
            labItem[labItemDef[i]] = req.body[labItemReq[i]];
        }
    }
    if (!isUpdate) {
        labItem.expItemId = new mongoose.Types.ObjectId;
    } else {
        labItem.modifiedDate = Date.now();
    }
    return labItem;
};
