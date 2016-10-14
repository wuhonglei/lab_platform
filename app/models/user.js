// 数据库模式 -- 用户
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config/config.js');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    number: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    salt: String, //为什么对密码进行hash运算时,要用salt
    email: {
        type: String,
        unique: true,
        required: true
    },
    isTeacher: {
        type: Boolean,
        required: true
    },
    resetToken: String
});

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function(password) {
    var password = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.password === password;
};

// 用户验证成功后, 返回给用户的token值
userSchema.methods.generateJwt = function() {
    var INTERVAL = 30 * 60 * 1000; //30min 等效毫秒
    var expiry = new Date(Date.now() + INTERVAL);

    var payload = {
        email: this.email,
        number: this.number,
        isTeacher: this.isTeacher,
        exp: parseInt(expiry.getTime() / 1000)
    };
    var options = { encoding: "base64" };
    var token = jwt.sign(payload, secret.secret); // DO NOT KEEP YOUT SECRET IN THE CODE!
    return token;
};

userSchema.methods.generateResCode = function(code, timelong) {
    var INTERVAL = timelong || 30 * 60 * 1000; //30min 等效毫秒
    var expiry = new Date(Date.now() + INTERVAL);
    var payload = {
        code: code,
        exp: parseInt(expiry.getTime() / 1000)
    };
    this.resetToken = jwt.sign(payload, secret.secret);
};

module.exports = mongoose.model('User', userSchema);
