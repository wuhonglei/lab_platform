// 数据库模式 -- 学生信息表
var mongoose = require('mongoose');

var studentInfoSchema = new mongoose.Schema({
    description: {
        type: String,
        unique: true,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    course: {
        type: String,
        required: true
    },
    class: String,
    info: [{
        index: { type: Number, default: 0 },
        number: Number,
        name: String
    }]
});

var infoListSChema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
        unique: true
    },
    years: [],
    courses: [],
    classes: [],
    descriptions: []
});

module.exports.StudentInfo = mongoose.model('StudentInfo', studentInfoSchema);
module.exports.InfoList = mongoose.model('InfoList', infoListSChema);
