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
            var INDEX = new Array();
            $scope.getCheckedIndex = function(index, isChecked) {
                if (isChecked) {
                    // 勾选后加入数组
                    INDEX.push(index);
                } else {
                    // 取消勾选后从数组中删除
                    var whereIS = INDEX.indexOf(index);
                    INDEX.splice(whereIS, 1);
                }
            };

            // edit the lab item
            $scope.getLabItem = function() {
                // the index of the edit lab item 
                var index = INDEX[INDEX.length - 1];
                var originItem = $scope.labItems[index];
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
                                    $scope.labItems[index][key] = item[key];
                                }
                                $scope.labItems[index].isChecked = false;
                                $('#edit-lab-modal').modal('hide');
                            }
                        }, function(response) {
                            // 请求失败
                            console.error(response);
                        });
                };
            };

            // delete the lab item
            $scope.getDeltedLabItem = function() {
                // 显示要被删除的项目
                var deletedItems = [];
                for (var i = 0, len = INDEX.length; i < len; i++) {
                    var obj = {
                        name: $scope.labItems[INDEX[i]].name,
                        index: INDEX[i],
                        expItemId: $scope.labItems[INDEX[i]].expItemId
                    };
                    deletedItems.push(obj);
                }
                $scope.deleteLabs = deletedItems;

                // 确认删除
                $scope.delete = function() {
                    LabItem.delete($scope.deleteLabs)
                        .then(function(response) {
                            // 请求成功
                            console.info(response);
                            var data = response.data;
                            var hasDeleted = data.hasDeleted;
                            var beenChoosed = data.beenChoosed;
                            var beenRefed = data.beenRefed;
                            // 取消已经被其他选择的实验勾选
                            for (var i = 0, len = beenChoosed.length; i < len; i++) {
                                $scope.labItems[beenChoosed[i]].isChecked = false;
                            }
                            // 取消已经被其他老师引用的实验勾选
                            for (var i = 0, len = beenRefed.length; i < len; i++) {
                                $scope.labItems[beenRefed[i]].isChecked = false;
                            }
                            // 删除允许被删除的实验
                            // 将允许删除的数组, 按照升序排序
                            hasDeleted.sort(function(a, b) {
                                return a - b;
                            });
                            var INCREASE = 0;
                            for (var i = 0, len = hasDeleted.length; i < len; i++) {
                                $scope.labItems.splice(hasDeleted[i] - INCREASE, 1);
                                INCREASE++;
                            }
                            // 隐藏模态框
                            $('#delete-lab-modal').modal('hide');
                        }, function(response) {
                            // 请求失败
                            console.error(response);
                        });
                };
            };
        }
    ]);
