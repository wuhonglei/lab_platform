// 密码找回界面 , 由于业务逻辑比较简单所以我将服务和控制器放在一个文件中
angular.module('userApp', [])
    .controller('PasswordCtrl', ['$http', '$scope', function($http, $scope) {
        // 发送验证码
        $scope.sendVerifyCode = function(email) {
            var url = '/user/send-verify-code';
            var data = { email: email };
            $http.post(url, data)
                .then(function(response) {
                    // 请求成功
                    if (response.data.success) {
                        console.info("验证码发送成功");
                        $scope.verifyCode = true;
                        $scope.resetPassword = function(reset) {
                            if (reset.newPasswd != reset.confirmPasswd || reset.newPasswd == undefined) {
                                return console.error("两次密码不一致");
                            }
                            url = '/user/reset-password';
                            data = {
                                email: reset.email,
                                code: reset.code,
                                password: reset.newPasswd
                            };
                            $http.post(url, data)
                                .then(function(response) {
                                    // 请求失败
                                    if (response.data.success) {
                                        // 密码修改成功
                                        console.log('密码修改成功');
                                        location.href = '/login.html';
                                    } else {
                                        $scope.reset = {};
                                    }
                                }, function(response) {
                                    // 请求失败
                                    console.error(response);
                                    $scope.reset = {};
                                });
                        };
                    }
                }, function(response) {
                    // 请求失败
                    console.error(response);
                });
        };
    }]);
