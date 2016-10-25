// 教师界面 -- 学生成绩控制器
'use strict';
angular.module('myApp')
    .controller('gradeLabsCtrl', ['$scope', 'Student', 'PDF', 'Alert', '$http', '$select', 'PublishedLabs',
        function($scope, Student, PDF, Alert, $http, $select, PublishedLabs) {
            var hasLoaded = false;
            $scope.selected = {};
            // 获取筛选列表
            (function getSelectCondition() {
                if (hasLoaded) {
                    return;
                }
                var url = '/teacher/get-selected-condition';
                $http.get(url).then(function(response) {
                    // 请求成功
                    if (response.data.success) {
                        var data = response.data;
                        var post = [{ value: true, label: "已提交" }, { value: false, label: "未提交" }];
                        var mark = [{ value: true, label: "已打分" }, { value: false, label: "未打分" }];
                        data.post = post;
                        data.mark = mark;
                        $scope.select = data;
                        hasLoaded = true;
                    }
                }, function(response) {
                    // 请求失败
                });
            })();


            // 获取选择该老师实验的学生列表
            $scope.getSelectCondition = function(selected) {
                Student.getList(selected)
                    .then(function(response) {
                        // 请求成功
                        $scope.labs = response.data.labPost;
                    }, function(response) {
                        // 请求失败
                        console.error(response);
                    });
            };

            // 如果是从布置实验跳转过来, 则向后台请求数据
            (function getSelected() {
                var selected = PublishedLabs.getSelected();
                if (selected) {
                    console.log('selected: ', selected);
                    $scope.selected = selected;
                    $scope.getSelectCondition(selected);
                } else {
                    return;
                }
            })();

            // 预览学生作业
            $scope.previewPDF = function(filename) {
                PDF.view(filename);
            };

            // 打分
            $scope.markScore = function(originScore, score, index) {
                if (!!score && originScore != score) {
                    // 如果修改了分数
                    score = parseInt(score);
                    // score = (+score); // 用来将字符串数字转换为 数字类型(负数也可以转换)
                    if (score >= 0 && score <= 100) {
                        var data = {
                            score: score,
                            expItemId: $scope.labs[index].expItemId,
                            studentNumber: $scope.labs[index].studentNumber
                        };
                        Student.mark(data)
                            .then(function(response) {
                                // 请求成功
                                console.info("分数修改成功");
                                Alert.show({ content: '修改成功' });
                            }, function(response) {
                                // 请求失败
                                console.error("修改失败\n%O", response);
                                $scope.labs[index].score = originScore;
                            });
                    } else {
                        console.error("分数要在0 -- 100之间");
                        var option = {
                            title: '错误!',
                            content: '分数要在0 - 100之间',
                            type: 'warning'
                        };
                        Alert.show(option);
                    }
                } else {
                    console.error("分数没有改变");
                    var option = {
                        content: '分数没有改变',
                        type: 'warning'
                    };
                    Alert.show(option);
                }
            };

        }
    ]);
