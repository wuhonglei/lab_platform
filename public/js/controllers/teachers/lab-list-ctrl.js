// 左侧导航栏 -- 
angular.module('myApp')
    .controller('CategoryNavCtrl', ['$scope', '$routeParams', '$filter', 'PersonalInfo', 'LabItem',
        function($scope, $routeParams, $filter, PersonalInfo, LabItem) {
            // 获取实验列表
            var category = $routeParams.categoryID;
            var labItems = LabItem.get(category);
            labItems
                .then(function(response) {
                    // 请求成功
                    if (response.data.success) {
                        $scope.labItems = response.data.labItems;
                    }
                }, function(response) {
                    // 请求失败
                    console.error(response);
                });
 
            // 添加新实验
            $scope.createLabItem = function(data) {
                if ($scope.addForm.labImage.$valid && $scope.labItem.image) {
                    data.labCategory = category;
                    data.createdByName = PersonalInfo.name;
                    data.createdByNumber = PersonalInfo.number;
                    LabItem.save(data)
                        .then(function(response) {
                            if (response.data.success) {
                                // 实验添加成功
                                // 隐藏模态框
                                var item = response.data.labItem;
                                $scope.labItems.unshift(item);
                                $('#create-lab-modal').modal('hide');
                                $scope.labItem = {};
                            }
                        }, function(response) {
                            // 请求失败
                            console.error(response);
                        });
                }
            };

            // checked number of the checkbox
            $scope.checkChoosed = function() {
                var checked = $filter("filter")($scope.labItems, { isChecked: true });
                return (checked === undefined) ? 0 : checked.length;
            };

            // display which checkbox is checked, return the array index
            var INDEX = undefined;
            $scope.getCheckedIndex = function(index) {
                INDEX = index;
            };
 
            // edit the lab item
            $scope.getLabItem = function() {
                var originItem = $scope.labItems[INDEX];
                $scope.update = {
                    name: originItem.name,
                    description: originItem.description
                };
                $scope.updateLabItem = function(update) {
                    LabItem.update(originItem, update)
                        .then(function(response) {
                            // 请求成功
                            if (response.data.success) {
                                var item = response.data.update;
                                // 更新数据
                                for (var key in item) {
                                    $scope.labItems[INDEX][key] = item[key];
                                }
                                $scope.labItems[INDEX].isChecked = false;
                                $('#edit-lab-modal').modal('hide');
                            }
                        }, function(response) {
                            // 请求失败
                            console.error(response);
                        });
                }
            };
        }
    ]);
