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
        type: String,
        required: true
    },
    className: String,
    course: String,
    year: String,
    teacherName: {
        type: String,
        required: true
    },
    teacherNumber: {
        type: String,
        required: true
    },
    choosedDate: {
        type: Date,
        default: Date.now
    },
    postDate: {
        type: Date
    },
    deadline: {
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

// 教师界面, 给某班级分配实验, 实验和学生之间的关系
var labChoosedByStuSChema = new mongoose.Schema({
    number: {
        type: String,
        required: true
    },
    classes: [{
        type: String,
        required: true
    }],
    courses: [{
        type: String,
        required: true
    }],
    years: [{
        type: String,
        required: true
    }],
    labNames: [{
        type: String,
        required: true
    }],
    expItemIds: [{
        type: mongoose.Schema.ObjectId,
        required: true
    }]
});
// 教师界面, 已布置实验列表
var labPublishedList = new mongoose.Schema({
    number: {
        type: String,
        required: true
    },
    expItemId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    description: String,
    labName: String,
    labCategory: String,
    class: String,
    course: String,
    year: String,
    publishedTime: {
        type: Date,
        default: Date.now
    },
    deadline: {
        type: Date
    }
});

module.exports.LabPost = mongoose.model('LabPost', labPostSchema);
module.exports.LabChoosedByStu = mongoose.model('LabChoosedByStu', labChoosedByStuSChema);
module.exports.LabPublishedList = mongoose.model('LabPublishedList', labPublishedList);
