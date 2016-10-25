// 学生界面 -- 实验详情控制器
angular.module('myApp')
    .controller('LabDetailCtrl', ['$scope', '$routeParams', 'LabDetail', 'LabRef', 'labPost', 'Alert',
        function($scope, $routeParams, LabDetail, LabRef, labPost, Alert) {
            var expItemId = $routeParams.expItemId;
            var category = $routeParams.category;
            // 获取实验详情 
            LabDetail.get(expItemId)
                .then(function(response) {
                    // 请求成功
                    $scope.htmlContent = response.data.labDetail.labDetail;
                    $scope.labName = response.data.labDetail.labName

                }, function(response) {
                    // 请求失败
                    console.error(respnose);
                });

            // 查询该学生是否选择了该实验
            LabRef.hasChoosed(expItemId)
                .then(function(response) {
                    // 请求成功
                    if (response.data.labPost != null) {
                        $scope.desc = response.data.labPost.teacherName;
                        $scope.hasChoosed = true;
                    } else {
                        // 请求引用列表
                        LabRef.get(expItemId)
                            .then(function(response) {
                                // 请求成功 
                                $scope.labRef = response.data.labRef;
                            }, function(respnose) {
                                // 请求成功
                                console.error("老师列表获取失败:", response);
                            });
                        $scope.desc = "请选择老师";
                        $scope.hasChoosed = false;
                    }
                }, function(response) {
                    // 请求失败
                    console.error(response);
                });

            // 学生选择实验后, 建立学生和老师之间的联系
            $scope.choose = function(selectTeacher) {
                if (selectTeacher != null) {
                    labPost.create($scope.labRef, selectTeacher, category)
                        .then(function(response) {
                            // 请求成功
                            Alert.show({ content: '老师选择成功' });
                            $scope.decs = selectTeacher.name;
                            $scope.hasChoosed = true;
                        }, function(response) {
                            // 请求失败
                            console.error(response);
                        });
                }
            };
        }
    ]);
