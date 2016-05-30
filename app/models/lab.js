// 定义实验项目表的结构, 包含实验列表, 实验详情, 实验引用关系表
var mongoose = require('mongoose');

// 实验列表 Schema
var labItemSchema = new mongoose.Schema({
    expItemId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        unique: true,
        default: new mongoose.Types.ObjectId
    },
    labCategory: {
        type: String,
        required: true
    },
    name: String,
    description: String,
    thumbnail: String,
    createdByName: {
        type: String,
        required: true
    },
    createdByNumber: {
        type: Number,
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    hardLevel: {
        type: String,
        default: "一般"
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    modifiedDate: {
        type: Date,
        default: Date.now
    }
});


// =================================================//

// 实验详情 Schema
var labDetailSchema = new mongoose.Schema({
    expItemId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        unique: true
    },
    expDetailId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        unique: true,
        default: new mongoose.Types.ObjectId
    },
    createdByName: {
        type: String,
        required: true
    },
    createdByNumber: {
        type: Number,
        required: true
    },
    labDetail: {
        type: String
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    modifiedDate: {
        type: Date,
        default: Date.now
    }
});

// ==================================================//
// 引用实验 Schema
var labRefSchema = new mongoose.Schema({
    expItemId: {
        type: mongoose.Schema.ObjectId,
        required: true,
        unique: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    labName: {
        type: String,
        required: true
    },
    createdByName: {
        type: String,
        required: true
    },
    refName: [{
        name: String,
        number: Number
    }
    ]
});


module.exports.LabItem = mongoose.model('LabItem', labItemSchema);
module.exports.LabDetail = mongoose.model('LabDetail', labDetailSchema);
module.exports.LabRef = mongoose.model('LabRef', labRefSchema);
