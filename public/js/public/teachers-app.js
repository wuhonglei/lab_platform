// 新建 module
var myApp = angular.module('myApp', ['ngRoute', 'ngFileUpload', 'textAngular', 'angularSpectrumColorpicker',
    'mgcrea.ngStrap.alert', 'mgcrea.ngStrap.select', 'ui.bootstrap', 'angularUtils.directives.dirPagination'
]);

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
            templateUrl: 'partials/teacher/published-labs.html',
            controller: 'publishedLabsCtrl'
        })
        // 布置实验
        .when('/publish-labs', {
            templateUrl: 'partials/teacher/publish-labs.html',
            controller: 'publishLabsCtrl'
        })
        // 已布置的实验
        .when('/published-labs', {
            templateUrl: 'partials/teacher/published-labs.html',
            controller: 'publishedLabsCtrl'
        })
        // 打分
        .when('/grade-labs', {
            templateUrl: 'partials/teacher/grade-labs.html',
            controller: 'gradeLabsCtrl'
        })
        // 导入学生信息
        .when('/import-student-info', {
            templateUrl: 'partials/teacher/import-student-info.html',
            controller: 'importStudentInfoCtrl'
        })
        // 管理学生名单
        .when('/manage-student-info', {
            templateUrl: 'partials/teacher/manage-student-info.html',
            controller: 'manageStudentInfoCtrl'
        })
        // 引用其他实验
        .when('/quote-labs', {
            templateUrl: 'partials/teacher/quote-labs.html',
            controller: 'quoteLabsCtrl'
        })
        // 实验工具
        .when('/lab-tools', {
            templateUrl: 'partials/public/lab-tools.html',
            controller: 'labToolsCtrl'
        })
        // 实验类别
        .when('/:categoryID', {
            templateUrl: 'partials/teacher/lab-item.html',
            controller: 'CategoryNavCtrl'
        })
        // 修改密码
        .when('/account/modify-password', {
            templateUrl: 'partials/public/modify-password.html',
            controller: 'ModifyPasswordCtrl'
        })
        // 实验详情
        .when('/category/:expItemId', {
            templateUrl: 'partials/teacher/lab-detail.html',
            controller: 'LabDetailCtrl'
        })
        // 实验详情
        .when('/:category/:expItemId', {
            templateUrl: 'partials/teacher/lab-detail.html',
            controller: 'LabDetailCtrl'
        });
}]);
