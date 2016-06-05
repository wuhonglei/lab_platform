// 登陆页面 
angular.module('userApp', ['ngMessages', 'mgcrea.ngStrap.alert'])
    .factory('Alert', ['$alert', function($alert) {
        var showAlert = function(option) {
            if (option == undefined) {
                option = {};
            }
            title = option.title || '';
            content = option.content || '执行成功';
            container = option.container || '#alertContainer';
            type = option.type || 'success';
            duration　 = 　option.duration || 3;
            // 配置项
            var alertOption = {
                // placement: placement,
                title: title,
                content: content,
                container: container,
                type: type,
                duration: duration　,
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
    // 登陆控制器
    .controller('LoginCtrl', ['$scope', '$http', '$location', '$window', 'Alert',
        function($scope, $http, $location, $window, Alert) {
            $scope.loginSubmited = false;
            $scope.signin = function(login, invalid) {
                $scope.loginSubmited = true;
                if (invalid) {
                    $('#username').focus();
                    return;
                }
                // 获取用户学号/教工号和密码
                var data = user = {
                    number: login.username,
                    password: login.password
                };

                var url = '/user/login';
                $http.post(url, data)
                    .then(function(response) {
                        // 请求成功  
                        // 登陆成功
                        var token = response.data.token;
                        var identity = response.data.identity;
                        $window.localStorage['token'] = token;
                        payload = token.split('.')[1];
                        payload = $window.atob(payload);
                        payload = JSON.parse(payload);
                        $window.localStorage['identity'] = payload.isTeacher ? 　'teacher' : 'student';
                        $scope.login = {};
                        $scope.loginSubmited = false;
                        location.href = '/';
                    }, function(response) {
                        // 请求失败
                        if (response.data.notCorrect) {
                            // 用户名或密码错误
                            Alert.show({ content: '用户名或密码错误', type: 'danger' });
                            $('#username').focus();
                        }
                    });
            };
        }
    ])
    // 注册控制器
    .controller('RegisterCtrl', ['$scope', '$http', 'Alert', function($scope, $http, Alert) {
        // 初始化 
        $scope.registerSubmited = false;
        $scope.signup = function(register, invalid) {
            $scope.registerSubmited = true;
            // 获取用户信息
            if (invalid || register.password != register.confirmPassword) {
                console.error("输入字段不符合要求");
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
                    $scope.register = {};
                    Alert.show({ title: '注册成功', content: '请登录' });
                    $scope.registerSubmited = false;
                }, function(response) {
                    // 请求失败
                    console.info(response);
                    if (response.data.isEmailExist) {
                        Alert.show({ title: '注册失败', content: '邮箱已存在', type: 'warning' });
                    }
                    if (response.data.isNumberExist) {
                        Alert.show({ title: '注册成功', content: '学号/教工号已存在', type: 'warning' });
                    }
                    $scope.registerSubmited = false;
                });
        }
    }]);
