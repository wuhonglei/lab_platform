// 教师界面 -- 学生信息控制器
'use strict';
angular.module('myApp')
    .controller('studentInfoCtrl', ['$scope', 'Excel', 'PersonalInfo', '$http',
        function($scope, Excel, PersonalInfo, $http) {
            // 解析上传的excel
            $scope.import = function(file) {
                Excel.excel2json(file).then(function(data) {
                    // 解析成功
                    $scope.classLists = data;
                    $scope.upload = function(info) {
                        var request = {
                            method: 'POST',
                            url: '/teacher/upload-student-info',
                            data: info
                        };
                        $http(request).then(function(response) {
                            // 请求成功
                            console.info('请求成功: ', response.data);
                        }, function(response) {
                            // 请求成功
                            console.error("请求失败: ", response.data);
                        });
                    }
                }, function(data) {
                    // 解析出错
                    $scope.error = data;
                    // 按下 ESC 按钮退出
                    $("#modal-excel-err").modal({
                        keyboard: true
                    });
                });
            };
        }
    ]);
