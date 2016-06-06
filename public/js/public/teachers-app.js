// 新建 module
var myApp = angular.module('myApp', ['ngRoute', 'ngFileUpload', 'textAngular', 'angularSpectrumColorpicker', 'mgcrea.ngStrap.alert']);

// 设置http默认的头部, 认证token是否过期
myApp.run(function($http, $window, $rootScope, Authentication) {
    $http.defaults.headers.common['x-access-token'] = $window.localStorage['token'];
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
        if (!Authentication.isLoggedIn()) {
            console.info("重新登陆");
            location.href = '/login.html';
        }
    });
});

// 路由模块
myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    // 根据<a href="#/id">  --导航--> /id
        .when('/', {
            templateUrl: 'partials/teacher/students-desc.html',
            controller: 'StudentsWorkDescCtrl'
        })
        .when('/:categoryID', {
            templateUrl: 'partials/teacher/lab-item.html',
            controller: 'CategoryNavCtrl'
        })
        .when('/account/modify-password', {
            templateUrl: 'partials/public/modify-password.html',
            controller: 'ModifyPasswordCtrl'
        })
        .when('/:category/:expItemId', {
            templateUrl: 'partials/teacher/lab-detail.html',
            controller: 'LabDetailCtrl'
        });
}]);
