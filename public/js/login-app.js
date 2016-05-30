/**
 *  Module
 * 
 * 用于登陆注册页面的控制器
 */
angular.module('userApp', [])
    // 登陆控制器
    .controller('LoginCtrl', ['$scope', '$http', '$location', '$window', function($scope, $http, $location, $window) {
        $scope.signin = function() {
            // 获取用户学号/教工号和密码
            var data = user = {
                number: $scope.login.username,
                password: $scope.login.password
            };
            // console.info(user);

            var url = '/user/login';
            $http.post(url, data)
                .then(function(response) {
                    // 请求成功  
                    if (response.data.success) {
                        // 登陆成功
                        console.info(response.data);
                        var token = response.data.token;
                        var identity = response.data.identity;
                        $window.sessionStorage['token'] = token;
                        payload = token.split('.')[1];
                        payload = $window.atob(payload);
                        payload = JSON.parse(payload);
                        $window.sessionStorage['identity'] = payload.isTeacher ? 　'teacher' : 'student';
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
        $scope.signup = function() {
            // 获取用户信息
            var data = user = {
                isTeacher: $scope.register.identity === "true",
                name: $scope.register.username,
                number: $scope.register.userId,
                email: $scope.register.email,
                password: $scope.register.password
            };
            // console.info(user);

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
