var express = require('express');
var router = express.Router();
var userAuth = require('../../controller/public/authentication');

// 用户注册
router.post('/login', userAuth.login);
// 用户注册
router.post('/register', userAuth.register);
// 用户密码重置(用户忘记密码后重置)
router.post('/reset-password', userAuth.resetPassword);

module.exports = router;
