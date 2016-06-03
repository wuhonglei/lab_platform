/**
 *  Module
 * 
 * 用于登陆注册页面的控制器
 */
angular.module('userApp', [])
    // 登陆控制器
    .controller('LoginCtrl', ['$scope', '$http', '$location', '$window', function($scope, $http, $location, $window) {
        $scope.signin = function(login) {
            // 获取用户学号/教工号和密码
            var data = user = {
                number: login.username,
                password: login.password
            };

            var url = '/user/login';
            $http.post(url, data)
                .then(function(response) {
                    // 请求成功  
                    if (response.data.success) {
                        // 登陆成功
                        var token = response.data.token;
                        var identity = response.data.identity;
                        $window.localStorage['token'] = token;
                        payload = token.split('.')[1];
                        payload = $window.atob(payload);
                        payload = JSON.parse(payload);
                        $window.localStorage['identity'] = payload.isTeacher ? 　'teacher' : 'student';
                        $scope.login = {};
                        location.href = '/';
                    }
                }, function(response) {
                    // 请求失败
                });
        };
    }])
    // 注册控制器
    .controller('RegisterCtrl', ['$scope', '$http', function($scope, $http) {
        $scope.signup = function(register) {
            // 获取用户信息
            if (register.identity == null) {
                console.error("请选择身份");
                return;
            }
            var data = user = {
                isTeacher: register.identity === "true",
                name: register.username,
                number: register.userId,
                email: register.email,
                password: register.password
            };

            var url = '/user/register';
            $http.post(url, data)
                .then(function(response) {
                    // 请求成功
                    if (response.data.success) {
                        $scope.register = {};
                    }
                }, function(response) {
                    // 请求失败
                });
        }
    }]);
