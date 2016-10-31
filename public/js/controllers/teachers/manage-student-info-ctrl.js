// 教师界面 -- 学生信息控制器
angular.module('myApp')
    .controller('manageStudentInfoCtrl', ['$scope', 'Excel', 'PersonalInfo', 'StudentInfo', 'Alert', '$select', '$http',
        function($scope, Excel, PersonalInfo, StudentInfo, Alert, $select, $http) {
            $scope.select = {
                years: [],
                courses: [],
                classes: [],
                descriptions: []
            };
            $scope.infoLists = [];
            $scope.selected = {};

            // 获取"筛选学生信息"里的开课日期, 课程, 班级列表, 描述信息
            var getFilterList = function() {
                var url = '/teacher/get-select-list';
                $http.get(url).then(function(response) {
                    /* body... */
                    if (response.data.success) {
                        var data = response.data.infoList;
                        console.log('data: ', data);
                        for (var key in $scope.select) {
                            $scope.select[key] = data[key];
                            $scope.select[key].unshift('不选择');
                        }
                        $scope.descriptions = data.descriptions;
                    }
                }, function(response) {
                    /* body... */
                });
            };
            // 立即执行
            getFilterList();

            //根据筛选条件, 获取学生信息列表
            $scope.getSelectedList = function(selected) {
                for (var key in selected) {
                    if (selected[key] === '不选择') {
                        delete selected[key];
                    }
                }
                StudentInfo.get(selected).then(function(response) {
                    // 请求成功
                    $scope.infoLists = response.data.infoLists;
                }, function(response) {
                    // 请求失败
                    Alert.show({ content: '信息获取失败', type: 'danger' });
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
                        getFilterList();
                    }
                }, function(response) {
                    // 请求失败
                    $('#modal-delete-student-info').modal('hide');
                    Alert.show({ content: "删除失败", type: 'danger' });
                });
            };
        }
    ]);
