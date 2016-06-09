// 验证token的有效性
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var secret = require('../../config/config.js');

module.exports = router.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, secret.secret, function(err, decoded) {
            if (err) {
                // TokenExpiredError, JsonWebTokenError
                return res.status(401).json({
                    success: false,
                    isLoggedOut: true,
                    message: 'token过期'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});
