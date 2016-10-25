// 教师界面 -- 导入学生信息
angular.module('myApp')
    .controller('importStudentInfoCtrl', ['$scope', 'Excel', 'PersonalInfo', 'StudentInfo', 'Alert', '$select', '$http',
        function($scope, Excel, PersonalInfo, StudentInfo, Alert, $select, $http) {
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
                            $scope.infoLists = data.reverse();
                            Alert.show({ content: '学生信息保存成功' });
                        }, function(response) {
                            // 保存失败
                            var content = response.data.description + "<br>" + response.data.errmsg;
                            $('#modal-preview-excel').modal('hide');
                            Alert.show({ content: content, type: 'danger' });
                        });
                    }
                }, function(result) {
                    if (result.data.success == false) {
                        $("#modal-excel-err").modal('hide');
                        Alert.show({ content: result.data.message, type: 'danger' });
                        return;
                    }
                    // 解析出错
                    $scope.error = result.data;
                    // 按下 ESC 按钮退出
                    $("#modal-excel-err").modal({
                        keyboard: true
                    });
                });
            };
        }
    ]);
