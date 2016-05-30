var express = require('express');
var router = express.Router();
var userAuth = require('../../controller/public/authentication');
var jwt = require('jsonwebtoken');
var secret = require('../../config/config.js');

// 用户注册
router.post('/login', userAuth.login);
// 用户注册
router.post('/register', userAuth.register);

module.exports = router;
