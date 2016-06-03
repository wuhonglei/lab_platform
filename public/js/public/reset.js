// 密码找回界面 , 由于业务逻辑比较简单所以我将服务和控制器放在一个文件中
angular.module('userApp', ['ngMessages', 'mgcrea.ngStrap.alert'])
    .factory('Alert', ['$alert', function($alert) {
        var showAlert = function(option) {
            if (option === undefined) {
                option = {};
            }
            title = option.title || '';
            content = option.content || '执行成功';
            container = option.container || 'body';
            type = option.type || 'success';

            // 配置项
            var alertOption = {
                title: title,
                content: content,
                container: container,
                type: type,
                duration: 3,
                show: false
            };

            // 初始化配置项
            var myAlert = $alert(alertOption);

            // 显示模态框
            myAlert.$promise.then(myAlert.show);
        };

        return {
            show: showAlert
        };
    }])
    .controller('PasswordCtrl', ['$http', '$scope', '$timeout', 'Alert',
        function($http, $scope, $timeout, Alert) {
            $scope.sendCode = false;
            $scope.hasSend = false;
            $scope.modify = false;
            $scope.timeCounter = "发送验证码";

            // 用户点击发送验证码后, 60s 后才能重新发送
            var timeoutID;
            var timeCounter60s = function() {
                if ($scope.timeCounter > 0) {
                    $scope.timeCounter--;
                    timeoutID = $timeout(timeCounter60s, 1000);
                } else {
                    $scope.timeCounter = '发送验证码';
                    $scope.timeDesc = '';
                    $scope.hasSend = false;
                    $timeout.cancel(timeoutID);
                }
            };

            // 发送验证码
            $scope.sendVerifyCode = function(email) {
                $scope.sendCode = true;
                if (email === undefined) {
                    console.error("邮箱格式有误");
                    return;
                }
                // 倒计时 60 秒
                $scope.hasSend = true;
                $scope.timeCounter = 60;
                $scope.timeDesc = ' 秒后重新发送';
                timeCounter60s();

                var url = '/user/send-verify-code';
                var data = { email: email };
                $http.post(url, data)
                    .then(function(response) {
                        // 请求成功
                        if (response.data.success) {
                            $scope.verifyCode = true;
                        }
                    }, function(response) {
                        // 请求失败
                        console.error(response);
                        // 邮箱不存在
                        if (response.data.notExist) {
                            var option = {
                                content: '邮箱不存在 ',
                                container: '#alertContainer',
                                type: 'warning'
                            };
                            Alert.show(option);
                        }
                    });
            };

            //============== 定义警告框样式 ================//
            // 1. 邮箱错误 2. 验证码错误 3. 密码不一致 4. 验证码发送失败
            // 4. 验证码发送失败

            // 修改密码
            $scope.resetPassword = function(reset, form) {
                $scope.modify = true;
                if (form.$invalid || reset.newPasswd != reset.confirmPasswd || reset.newPasswd == undefined) {
                    return;
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
                            $scope.reset = {};
                            $scope.sendCode = false;
                            var option = {
                                content: '密码修改成功 ',
                                container: '#alertContainer',
                                type: 'success'
                            };
                            Alert.show(option);
                        }
                    }, function(response) {
                        // 请求失败
                        console.error(response);
                        if (response.data.notCorrect) {
                            var option = {
                                content: '验证码错误 ',
                                container: '#alertContainer',
                                type: 'danger'
                            };
                            Alert.show(option);
                        }
                    });
            };
        }
    ]);
