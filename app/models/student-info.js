// 数据库模式 -- 学生信息表
var mongoose = require('mongoose');

var studentInfoSchma = new mongoose.Schema({
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

module.exports = mongoose.model('StudentInfo', studentInfoSchma);
