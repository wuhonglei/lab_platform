// 用户身份认证函数
var passport = require('passport');
require('../../config/password')(passport);
var User = require('../../models/user');

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
