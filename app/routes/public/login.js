var express = require('express');
var router = express.Router();
var userAuth = require('../../controller/public/authentication');

// 用户注册
router.post('/login', userAuth.login);
// 用户注册
router.post('/register', userAuth.register);


module.exports = router;
