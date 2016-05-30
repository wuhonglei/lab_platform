// var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport) {
    passport.use(new LocalStrategy({
            usernameField: 'number',
            passwordField: 'password'
        },
        function(username, password, done) {
            User.findOne({ number: username }, function(err, user) {
                if (err) {
                    return done(err);
                }
                // Return if user not found in database
                if (!user) {
                    return done(null, false, {
                        message: 'User not found'
                    });
                }
                // Return if password is wrong
                if (!user.validPassword(password)) {
                    return done(null, false, {
                        message: 'Password is wrong'
                    });
                }
                // If credentials are correct, return the user object
                return done(null, user);
            });
        }
    ));
};
