// 定义学生选择某知道老师实验后创建的表的结构, 学生作业, 实验作业表
var mongoose = require('mongoose');

// 学生界面, 学生提交实验作业 Schema
var labPostSchema = new mongoose.Schema({
    expItemId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    labName: {
        type: String,
        required: true
    },
    studentName: {
        type: String,
        required: true
    },
    studentNumber: {
        type: Number,
        required: true
    },
    teacherName: {
        type: String,
        required: true
    },
    teacherNumber: {
        type: Number,
        required: true
    },
    choosedDate: {
        type: Date,
        default: Date.now
    },
    postDate: {
        type: Date
    },
    isPost: {
        type: Boolean,
        default: false
    },
    isMarked: {
        type: Boolean,
        default: false
    },
    workUrl: String,
    score: Number,
});

module.exports.LabPost = mongoose.model('LabPost', labPostSchema);
