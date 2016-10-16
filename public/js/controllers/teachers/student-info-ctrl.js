// 教师界面 -- 学生信息控制器
'use strict';
angular.module('myApp')
    .controller('studentInfoCtrl', ['$scope', 'Excel', 'PersonalInfo', 'StudentInfo', 'Alert', '$select', '$http',
        function($scope, Excel, PersonalInfo, StudentInfo, Alert, $select, $http) {
            var hasLoadedSelect = false;
            $scope.select = {
                years: [],
                courses: [],
                classes: [],
                descriptions: []
            };
            $scope.infoLists = [];
            $scope.selected = {};
            // 获取学生信息列表
            StudentInfo.get().then(function(response) {
                // 请求成功
                $scope.infoLists = response.data.infoLists;
            }, function(response) {
                // 请求失败
                Alert.show({ content: '信息获取失败', type: 'danger' });
            });

            // 解析上传的excel
            $scope.import = function(file) {
                Excel.excel2json(file).then(function(result) {
                    var data = result.data;
                    // 解析成功
                    if (data.length == 0) {
                        return Alert({ content: '您上传的表格为空', type: 'danger' });
                    }
                    $('#modal-preview-excel').modal('show');
                    $scope.classLists = data;
                    // 处理提交请求
                    $scope.upload = function() {
                        StudentInfo.save(result).then(function(response) {
                            // 保存成功
                            $('#modal-preview-excel').modal('hide');
                            $scope.infoLists = data.reverse().concat($scope.infoLists);
                            Alert.show({ content: '学生信息保存成功' });
                            hasLoadedSelect = false;
                            $scope.getSelectedList();
                        }, function(response) {
                            // 保存失败
                            var content = response.data.description + "<br>" + response.data.errmsg;
                            $('#modal-preview-excel').modal('hide');
                            Alert.show({ content: content, type: 'danger' });
                        });
                    }
                }, function(result) {
                    // 解析出错
                    $scope.error = result.data;
                    // 按下 ESC 按钮退出
                    $("#modal-excel-err").modal({
                        keyboard: true
                    });
                });
            };

            // 获取"筛选学生信息"里的开课日期, 课程, 班级列表, 描述信息
            $scope.getSelectedList = function() {
                if (hasLoadedSelect) {
                    return;
                }
                var url = '/teacher/get-select-list';
                $http.get(url).then(function(response) {
                    /* body... */
                    if (response.data.success) {
                        var data = response.data.infoList;
                        for (var key in $scope.select) {
                            $scope.select[key] = data[key];
                        }
                        $scope.descriptions = data.descriptions;
                        hasLoadedSelect = true;
                    }
                }, function(response) {
                    /* body... */
                });
            };

            // 删除某班级学生信息
            $scope.deleteClass = function(description) {
                if (!description) return;
                var url = '/teacher/delete-class-info';
                var data = {
                    description: description
                };
                $http.post(url, data).then(function(response) {
                    // 请求成功
                    if (response.data.success) {
                        $('#modal-delete-student-info').modal('hide');
                        Alert.show({ content: "删除成功" });
                        $scope.infoLists = $scope.infoLists.filter(function(element, index, array) {
                            return element.description != description;
                        });
                        hasLoadedSelect = false;
                        $scope.getSelectedList();
                    }
                }, function(response) {
                    // 请求失败
                    $('#modal-delete-student-info').modal('hide');
                    Alert.show({ content: "删除失败", type: 'danger' });
                    console.error('删除失败');
                });
            };
        }
    ]);
