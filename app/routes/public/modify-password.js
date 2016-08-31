// 路由 -- 修改密码
var express = require('express');
var router = express.Router();
var userAuth = require('../../controller/public/authentication');

// 密码修改
router.put('/modify-password', userAuth.modifyPassWord);

module.exports = router;