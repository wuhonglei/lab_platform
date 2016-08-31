// 用户身份认证函数
var passport = require('passport');
require('../../config/password')(passport);
var User = require('../../models/user');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var secret = require('../../config/config.js');
var async = require('async');

// 用户注册
module.exports.register = function(req, res) {
    var user = new User();
    // 获取请求的参数(用户名, 学号/教工号, 邮箱, 身份)
    user.name = req.body.name;
    user.number = req.body.number;
    user.email = req.body.email;
    user.isTeacher = req.body.isTeacher;

    // 先查询该用户是否已经注册
    // 异步任务集合
    var asyncSearchTasks = [];
    var isNumberExist = isEmailExist = false;
    asyncSearchTasks.push(function(callback) {
        // 先查询学号是否已经存在
        User.findOne({ number: user.number }, function(err, user) {
            if (err) {
                return callback(!null, err);
            }
            if (!!user) {
                // 学号已经注册
                isNumberExist = true;
                callback(null, true);
            } else {
                // 学号没有注册
                callback(null, false);
            }
        });
    });

    asyncSearchTasks.push(function(callback) {
        // 查询邮箱是否已经注册
        User.findOne({ email: user.email }, function(err, user) {
            if (err) {
                return callback(!null, err);
            }
            if (!!user) {
                // 邮箱已经注册
                isEmailExist = true
                callback(null, true);
            } else {
                // 邮箱没有注册
                callback(null, false);
            }
        });
    });

    // 执行异步任务集合
    // 执行异步任务集合
    async.parallel(asyncSearchTasks, function(err, result) {
        if (err) {
            return res.status(404).json({
                success: false,
                message: "注册失败"
            });
        }
        if (!isNumberExist && !isEmailExist) {
            // 密码加密后存储
            user.setPassword(req.body.password);
            user.save(function(err) {
                if (err) {
                    return res.status(404).json({
                        success: false,
                        message: '注册失败'
                    });
                }
                var token = user.generateJwt();
                res.status(200);
                res.json({
                    "success": true,
                    "token": token
                });
            });
        } else {
            return res.status(401).json({
                success: false,
                isNumberExist: isNumberExist,
                isEmailExist: isEmailExist
            });
        }
    });
};

// 用户登陆
module.exports.login = function(req, res) {
    // If Passport throws/catches an error
    passport.authenticate('local', function(err, user, info) {
        var token;

        if (err) {
            res.status(404).json(err);
            return;
        }

        if (user) {
            // 如果该用户存在
            var token = user.generateJwt();
            res.status(200).json({
                "success": true,
                "token": token
            });
        } else {
            // 如果该用户不存在
            res.status(401).json({
                success: false,
                notCorrect: true,
                message: '用户名或密码错误'
            });
        }
    })(req, res);

};

// 用户修改密码
module.exports.modifyPassWord = function(req, res) {
    // password 对象, 存放当前密码, 新密码, 确认密码
    var password = JSON.parse(req.body.password);
    if (password.newPasswd != password.confirmPasswd) {
        return res.status(401).json({
            success: false,
            message: "两次密码输入不一致"
        });
    }
    if (password.newPasswd === password.curPasswd) {
        return res.status(401).json({
            success: false,
            message: "新密码与当前密码不能相同"
        });
    }
    req.body.number = req.decoded.number;
    req.body.password = password.curPasswd;
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            res.status(404).json(err);
            return;
        }

        if (user) {
            // 如果该用户存在
            user.setPassword(password.newPasswd);
            user.save(function(err) {
                if (err) {
                    return res.status(404).json({
                        success: false,
                        message: '密码修改失败'
                    });
                }
                return res.status(200).json({
                    success: true,
                    message: '密码修改成功'
                });
            });
        } else {
            // 如果该用户不存在
            res.status(401).json({
                success: false,
                notExist: true,
                message: '密码错误'
            });
        }
    })(req, res);
};

// 用户重置密码:　发送验证码
module.exports.sendVerifyCode = function(req, res) {
    // 先验证该用户是否存在
    var email = req.body.email;
    var query = { email: email };
    User.findOne(query, function(err, user) {
        if (err) {
            return res.status(404).json({
                success: false,
                message: "重置失败"
            });
        }
        if (user != null) {
            // 生成 6 位数的随机数字, 作为验证码发送给用户
            var CODE = Math.round(100000 + Math.random() * 90000);
            // 如果用户存在, 发送验证码到用户邮箱
            // create reusable transporter object using the default SMTP transport
            var smtpTransport = nodemailer.createTransport({
                host: 'smtp.163.com',
                port: 465,
                secure: true, // use SSL
                auth: {
                    user: "lab_csu_edu_cn@163.com", // 账号
                    pass: "WHL1993105" // 密码
                }
            });
            // setup e-mail data with unicode symbols
            var mailOptions = {
                from: "实验管理平台 <lab_csu_edu_cn@163.com>",
                to: email,
                subject: "密码重置",
                html: '<p>该邮件来自于中南大学实验管理平台, 重置密码的验证码是 <b>' + CODE + '</b></p>' // html body: "加油"
            }
            smtpTransport.sendMail(mailOptions, function(err, response) {
                if (err) {
                    console.error("错误:", err)
                    return res.status(404).json({
                        success: false,
                        message: "验证码发送失败"
                    });
                }
                // 将验证码信息存储到该用户的 document 中
                user.generateResCode(CODE);
                user.save();
                return res.status(200).json({
                    success: true,
                    message: "验证码发送成功"
                });
            });

        } else {
            // 该用户不存在
            return res.status(401).json({
                success: false,
                notExist: true
            });
        }
    });
};

// 密码重置：　重置密码
module.exports.resetPassword = function(req, res) {
    var code = req.body.code;
    var email = req.body.email;
    var password = req.body.password;
    if (code === undefined) {
        return res.status(401).json({
            success: false,
            message: "请填写验证码"
        });
    }
    // 查询条件
    var query = { email: email };
    User.findOne(query, function(err, user) {
        if (err) {
            return res.status(404).json({
                success: false,
                message: "数据库查询失败"
            });
        }
        jwt.verify(user.resetToken, secret.secret, function(err, decoded) {
            if (err) {
                return res.status(404).json({
                    success: false,
                    message: '验证码已过期, 请重新获取'
                });
            }
            if (code == decoded.code) {
                user.setPassword(password);
                // 让验证码立即过期, 不能重复验证
                user.generateResCode(code, 0);
                user.save(function(err) {
                    if (err) {
                        return res.status(404).json({
                            success: false,
                            message: "密码修改失败"
                        });
                    }
                    return res.status(200).json({
                        success: true,
                        message: "密码修改成功"
                    });
                });
            } else {
                // 验证码不正确
                return res.status(401).json({
                    success: false,
                    notCorrect: true
                });
            }
        });
    });
};
