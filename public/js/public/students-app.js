// 学生界面 -- 新建模块
// 新建 module
var myApp = angular.module('myApp', ['ngRoute', 'ngSanitize', 'ngFileUpload', 'mgcrea.ngStrap.alert', 'angularUtils.directives.dirPagination']);

// 设置http默认的头部
myApp.run(function($http, $window, $rootScope, Authentication) {
    $http.defaults.headers.common['x-access-token'] = $window.localStorage['token'];
    $rootScope.$on('$routeChangeStart', function(event, nextRoute, currentRoute) {
        if (!Authentication.isLoggedIn()) {
            location.href = '/login.html';
        }
    });
});

// 路由模块
myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    // 根据<a href="#/id">  --导航--> /id
        .when('/', {
            templateUrl: 'partials/students/work-desc.html',
            controller: 'StudentsWorkDescCtrl'
        })
        .when('/account/modify-password', {
            templateUrl: 'partials/public/modify-password.html',
            controller: 'ModifyPasswordCtrl'
        })
        .when('/post-work', {
            templateUrl: 'partials/students/post-work.html',
            controller: 'PostWorkCtrl'
        })
        .when('/:categoryID', {
            templateUrl: 'partials/students/lab-item.html',
            controller: 'CategoryNavCtrl'
        })
        .when('/:category/:expItemId', {
            templateUrl: 'partials/students/lab-detail.html',
            controller: 'LabDetailCtrl'
        })
}]);
