// 教师界面 -- 学生提交的作业概览控制器
'use strict';
angular.module('myApp')
    .controller('StudentsWorkDescCtrl', ['$scope', 'Student', 'PDF',
        function($scope, Student, PDF) {
            // 获取选择该老师实验的学生列表
            Student.getList()
                .then(function(response) {
                    // 请求成功
                    console.info(response);
                    $scope.labs = response.data.labPost;
                }, function(response) {
                    // 请求失败
                    console.error(response);
                });

            // 预览学生作业
            $scope.previewPDF = function(filename) {
                PDF.view(filename);
            };

            // 打分
            $scope.markScore = function(originScore, score, index, isEqual) {
                if (score != undefined && originScore != score) {
                    // 如果修改了分数
                    var score = parseInt(score);
                    if (score >= 0 && score <= 100) {
                        var data = {
                            score: score,
                            expItemId: $scope.labs[index].expItemId,
                            studentNumber: $scope.labs[index].studentNumber
                        };
                        console.info("req = %o", data)
                        Student.mark(data)
                            .then(function(response) {
                                // 请求成功
                                console.info(response);
                            }, function(response) {
                                // 请求失败
                                console.error(response);
                            });
                    } else {
                        console.error("分数要在0 -- 100之间");
                    }
                } else {
                    console.error("分数没有改变");
                }
            };

        }
    ]);
