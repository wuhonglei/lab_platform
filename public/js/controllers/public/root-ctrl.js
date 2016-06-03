// Myctrl 根控制器
angular.module('myApp')
    .controller('MyCtrl', ['$scope', 'Authentication', 'PersonalInfo',
        function($scope, Authentication, PersonalInfo) {
            // 动态加载js文件
            $scope.loadScript = function(url, type, charset) {
                if (type === undefined) type = 'text/javascript';
                if (url) {
                    var script = document.querySelector("script[src*='" + url + "']");
                    if (!script) {
                        var body = document.getElementsByTagName("body");
                        if (body && body.length) {
                            var body = body[0];
                            if (body) {
                                // if (script) {
                                //     body.removeChild(script);
                                // }
                                script = document.createElement('script');
                                script.setAttribute('src', url);
                                script.setAttribute('type', type);
                                if (charset) script.setAttribute('charset', charset);
                                body.appendChild(script);
                            }
                        }
                    }
                    return script;
                }
            };

            // 顶部导航栏显示用户姓名
            $scope.username = PersonalInfo.name;

            // 用户 注销登陆
            $scope.logout = function() {
                Authentication.logout();
                location.href = '/login.html';
            };
        }
    ]);
