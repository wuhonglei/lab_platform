// 用户身份认证函数
var passport = require('passport');
require('../../config/password')(passport);
var User = require('../../models/user');
var nodemailer = require('nodemailer');

// 用户注册
module.exports.register = function(req, res) {
    var user = new User();
    // 获取请求的参数(用户名, 学号/教工号, 邮箱, 身份)
    user.name = req.body.name;
    user.number = req.body.number;
    user.email = req.body.email;
    user.isTeacher = req.body.isTeacher;

    // 密码加密后存储
    user.setPassword(req.body.password);

    user.save(function(err) {
        var token = user.generateJwt();
        res.status(200);
        res.json({
            "success": true,
            "token": token
        });
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
            res.status(200);
            res.json({
                "success": true,
                "token": token
            });
        } else {
            // 如果该用户不存在
            res.status(401).json(info);
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
                message: '密码错误'
            });
        }
    })(req, res);
};

// 用户重置密码(用户忘记密码后需重置密码)
module.exports.resetPassword = function(req, res) {
    // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport('smtps://user%40gmail.com:pass@smtp.gmail.com');
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: '"Fred Foo 👥" <foo@blurdybloop.com>', // sender address
        to: '1017368065@qq.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world 🐴', // plaintext body
        html: '<b>Hello world 🐴</b>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
};
