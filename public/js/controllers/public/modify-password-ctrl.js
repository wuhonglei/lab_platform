// 顶部导航栏 -- 修改密码
angular.module('myApp')
    .controller('ModifyPasswordCtrl', ['$scope', 'Password', 'Alert', '$timeout',
        function($scope, Password, Alert, $timeout) {
            // 初始化 文本输入框类型
            $scope.submited = false;
            $scope.inputType = 'password';
            $scope.toggleInputType = function(inputType) {
                $scope.inputType = (inputType === 'password') ? 'text' : 'password';
            };

            //  点击确认修改按钮
            $scope.modifyPasswd = function(password, invalid) {
                $scope.submited = true;
                // 新密码两次输入不一致
                if (invalid || password.newPasswd != password.confirmPasswd) {
                    return;
                }
                if (password.newPasswd === password.curPasswd) {
                    return console.error("新密码与当前密码不能相同");
                }

                Password.modify(password)
                    .then(function(response) {
                        // 请求成功
                        password = {};
                        Alert.show({ content: '密码修改成功<br>3秒后跳转到登陆界面' });
                        $timeout(function() {
                            location.href = '/login.html';
                        }, 3000);
                    }, function(response) {
                        // 请求失败
                        console.error("response = ", response);
                        if (response.data.notExist) {
                            // 当前密码有误
                            Alert.show({ content: '当前密码有误', type: 'danger' });
                        }
                    });
            };
        }
    ]);
