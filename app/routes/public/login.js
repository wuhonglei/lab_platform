var express = require('express');
var router = express.Router();
var userAuth = require('../../controller/public/authentication');

// 用户注册
router.post('/login', userAuth.login);
// 用户注册
router.post('/register', userAuth.register);
// 重置密码: 发送验证码
router.post('/send-verify-code', userAuth.sendVerifyCode);
// 重置密码: 重置密码
router.post('/reset-password', userAuth.resetPassword);
module.exports = router;
