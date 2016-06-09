// 左侧导航栏 --  
angular.module('myApp')
    .controller('CategoryNavCtrl', ['$scope', '$routeParams', '$filter', 'PersonalInfo', 'LabItem', 'Alert', 'Sidebar',
        function($scope, $routeParams, $filter, PersonalInfo, LabItem, Alert, Sidebar) {
            // 获取实验列表 
            var category = $routeParams.categoryID;
            $scope.navName = Sidebar.name(category);
            $scope.labItems = [];
            $scope.totalItems = 0;
            // display 5 items one page
            $scope.itemPerPage = 5;
            $scope.currentPage = 1;

            var url;
            if (category != 'my-labs') {
                url = '/teacher/' + category + '/get-items';
            } else {
                $scope.myLab = true;
                // 获取左侧导航的数据
                var categories = Sidebar.show();
                // 删除第一条数据 (我的导航)
                categories.shift();
                $scope.categories = categories;
                url = '/teacher/get-personal-labs';
            }

            var getResultsPage = function(newPage) {
                var data = {
                    limit: $scope.itemPerPage,
                    pageNumber: newPage
                };
                LabItem.get(url, data)
                    .then(function(response) {
                        // 请求成功
                        $scope.labItems = response.data.labItems;
                        $scope.totalItems = response.data.count;
                    }, function(response) {
                        // 请求失败
                        console.error(response);
                    });
            };

            // 第一次默认加载首页
            getResultsPage($scope.currentPage);

            // 分页, 浏览下一页实验列表
            $scope.pageChangeHandler = function(newPageNumber) {
                // 请求新的 items 内容
                getResultsPage(newPageNumber);
            };

            // 添加新实验
            $scope.addSubmited = false;
            $scope.createLabItem = function(data, invalid) {
                $scope.addSubmited = true;
                if (invalid) {
                    // 表单输入无效
                    return;
                }
                if ($scope.labItem.image) {
                    if (!$scope.myLab) {
                        data.labCategory = category;
                    }
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
                                Alert.show({ content: '实验创建成功' });
                                $scope.addSubmited = false;
                                $scope.labItem = {};
                            }
                        }, function(response) {
                            // 请求失败
                            console.error(response);
                        });
                }
            };

            // 创建实验 -- 取消
            $scope.cancelCreateLabItem = function() {
                $scope.addSubmited = false;
                $scope.labItem = {};
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
                // get the last element of the INDEX array
                var index = INDEX.slice(-1);
                var originItem = $scope.labItems[index];
                $scope.update = {
                    name: originItem.name,
                    description: originItem.description,
                    isPublic: originItem.isPublic,
                    labCategory: originItem.labCategory
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
                                // 遍历勾选的下标数组, 将实验列表项, 取消勾选
                                INDEX.forEach(function(index) {
                                    $scope.labItems[index].isChecked = false;
                                });
                                $('#edit-lab-modal').modal('hide');
                                // 清空checked item index array
                                INDEX.length = 0;
                                Alert.show({ content: '实验修改成功' });

                            }
                        }, function(response) {
                            // 请求失败
                            console.error(response);
                            Alert.show({ content: '实验修改失败', type: 'danger' });
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
                            $('#delete-lab-modal').modal('hide');
                            // 取消已经被其他选择的实验勾选
                            for (var i = 0, len = beenChoosed.length; i < len; i++) {
                                $scope.labItems[beenChoosed[i]].isChecked = false;
                                var option = {
                                    title: '删除失败',
                                    content: $scope.labItems[beenChoosed[i]].name + ' 已经有学生选择该实验',
                                    type: 'warning',
                                    duration: 5
                                };
                                Alert.show(option);
                            }
                            // 取消已经被其他老师引用的实验勾选
                            for (var i = 0, len = beenRefed.length; i < len; i++) {
                                $scope.labItems[beenRefed[i]].isChecked = false;
                                var option = {
                                    title: '删除失败',
                                    content: $scope.labItems[beenRefed[i]].name + ' 已经有老师选择该实验',
                                    type: 'warning',
                                    duration: 5
                                };
                                Alert.show(option);
                            }
                            // 删除允许被删除的实验
                            // 将允许删除的数组, 按照升序排序
                            hasDeleted.sort(function(a, b) {
                                return a - b;
                            });
                            for (var i = INCREASE = 0, len = hasDeleted.length; i < len; i++) {
                                var option = {
                                    content: $scope.labItems[hasDeleted[i] - INCREASE].name + '　成功删除',
                                    duration: 5
                                };
                                Alert.show(option);
                                $scope.labItems.splice(hasDeleted[i] - INCREASE, 1);
                                INCREASE++;
                            }
                            // 隐藏模态框
                            // 清空checked item index array
                            INDEX.length = 0;
                        }, function(response) {
                            // 请求失败
                            console.error(response);
                        });
                };
            };
        }
    ]);
