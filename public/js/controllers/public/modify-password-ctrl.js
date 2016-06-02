// 顶部导航栏 -- 修改密码
angular.module('myApp')
    .controller('ModifyPasswordCtrl', ['$scope', 'Password', function($scope, Password) {
        // 初始化 文本输入框类型
        $scope.inputType = 'password';
        $scope.toggleInputType = function(inputType) {
            $scope.inputType = (inputType === 'password') ? 'text' : 'password';
        };

        //  点击确认修改按钮
        $scope.modifyPasswd = function(password) {
            console.info('password = ', password);
            // 新密码两次输入不一致
            if (password.newPasswd != password.confirmPasswd) {
                return console.error("两次密码输入不一致");
            }
            if (password.newPasswd === password.curPasswd) {
                return console.error("新密码与当前密码不能相同")
            }

            Password.modify(password)
                .then(function(respnose) {
                    // 请求成功
                    password = {};
                    location.href = '/login.html';
                }, function(respnose) {
                    // 请求失败
                    console.error("respnose = ", respnose);
                    123
                });
        };
    }]);
