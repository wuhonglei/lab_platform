// 教师界面 -- 学生信息控制器
'use strict';
angular.module('myApp')
    .controller('studentInfoCtrl', ['$scope', 'Upload', 'Excel',
        function($scope, Upload, Excel) {
            // 解析上传的excel
            $scope.upload = function(file) {
                Excel.excel2json(file).then(function (data) {
                	$scope.classLists = data;
                });
            };
        }
    ]);
