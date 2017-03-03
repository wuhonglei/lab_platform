// 教师界面 -- 实验列表
angular.module('myApp')
    .controller('CategoryNavCtrl', ['$scope', '$routeParams', '$filter', 'PersonalInfo', 'LabItem', 'Alert', 'Sidebar',
        function($scope, $routeParams, $filter, PersonalInfo, LabItem, Alert, Sidebar) {
            var category = $routeParams.categoryID;
            $scope.navName = Sidebar.name(category);
            $scope.labItems = [];
            $scope.totalItems = 0;
            // display 5 items one page
            $scope.itemPerPage = 5;
            $scope.currentPage = 1;
            $scope.checkedLen = 0;
            var labItemsArray = new Array();
            var url;

            if (category != 'my-labs') {
                url = '/teacher/' + category + '/get-items';
            } else {
                $scope.myLab = true;
                // 获取左侧导航的数据
                url = '/teacher/get-personal-labs';
            }
            var categories = Sidebar.categories();
            $scope.categories = categories;

            // 获取实验列表 
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
                // 先从保存的勾选数组中寻找有没有当前页的数据
                var length = labItemsArray.length;
                var index = -1;
                for (var i = 0; i < length; i++) {
                    if (JSON.parse(labItemsArray[i]).currentPage == newPageNumber) {
                        index = i;
                    }
                }
                if (index != -1) {
                    $scope.labItems = JSON.parse(labItemsArray[index]).labItems;
                } else {
                    // 请求新的 items 内容
                    getResultsPage(newPageNumber);
                }
            };

            // 添加新实验
            $scope.addSubmited = false;
            $scope.createLabItem = function(data, invalid) {
                console.log('提交的数据:', data);
                $scope.addSubmited = true;
                if (!invalid && $scope.labItem.image) {
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
            $scope.getCheckedIndex = function(index, isChecked, labItems, currentPage) {
                var obj = {
                    currentPage: currentPage,
                    index: index,
                    labItems: labItems
                };
                if (isChecked) {
                    // 勾选后加入数组
                    labItemsArray.push(JSON.stringify(obj));
                    $scope.checkedLen++;
                } else {
                    // 取消勾选后从数组中删除
                    obj.labItems[index].isChecked = true;
                    var whereIS = labItemsArray.indexOf(JSON.stringify(obj));
                    obj.labItems[index].isChecked = false;
                    if (whereIS != -1) {
                        labItemsArray.splice(whereIS, 1);
                        $scope.checkedLen--;
                    }
                }
            };

            // edit the lab item
            $scope.getLabItem = function() {
                // the index of the edit lab item 
                // get the last element of the INDEX array
                var labItemObj = JSON.parse(labItemsArray.pop());
                var index = labItemObj.index;
                var originItem = labItemObj.labItems[index];
                console.log('编辑项目: ', originItem);
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
                                // 如果修改了实验类别, 将当前修改的实验项目从实验列表中移除
                                if ($scope.myLab || !item.hasOwnProperty('labCategory')) {
                                    for (var key in item) {
                                        originItem[key] = item[key];
                                    }
                                    labItemObj.labItems[index] = originItem;
                                    labItemsArray.push(JSON.stringify(labItemObj));
                                } else {
                                    labItemObj.labItems.splice(index, 1);
                                    labItemsArray.push(JSON.stringify(labItemObj));
                                }
                                if (labItemObj.currentPage === $scope.currentPage) {
                                    console.log('items: ', labItemObj);
                                    for (var i = 0, len = labItemObj.labItems.length; i < len; i++) {
                                        labItemObj.labItems[i].isChecked = false;
                                    }
                                    $scope.labItems = labItemObj.labItems;
                                }
                                $('#edit-lab-modal').modal('hide');
                                // 清空checked item index array
                                Alert.show({ content: '实验修改成功' });
                                labItemsArray = [];
                                $scope.checkedLen = 0;
                            }
                        }, function(response) {
                            // 请求失败
                            console.error(response);
                            Alert.show({ content: '实验修改失败', type: 'danger' });
                        });
                };
            };


            $scope.categoryLabel = function(select) {
                return Sidebar.name(select);
            };


            // 在实验列表中寻找 id 所在的下标 
            var getIndexOfId = function(id) {
                var result = -1;
                angular.forEach($scope.labItems, function(labItem, index) {
                    if (id == labItem.expItemId) {
                        result = index;
                        return;
                    }
                });

                return result;
            };


            // delete the lab item
            $scope.getDeltedLabItem = function() {
                // 显示要被删除的项目
                var deletedItems = [];
                for (var i = 0, len = labItemsArray.length; i < len; i++) {
                    var labItemObj = JSON.parse(labItemsArray[i]);
                    var index = labItemObj.index;
                    var obj = {
                        name: labItemObj.labItems[index].name,
                        expItemId: labItemObj.labItems[index].expItemId
                    };
                    deletedItems.push(obj);
                }
                $scope.deleteLabs = deletedItems;
                // 确认删除
                $scope.delete = function() {
                    LabItem.delete($scope.deleteLabs)
                        .then(function(response) {
                            // 请求成功
                            var data = response.data;
                            var hasDeleted = data.hasDeleted;
                            var beenChoosed = data.beenChoosed;
                            var beenRefed = data.beenRefed;
                            $('#delete-lab-modal').modal('hide');
                            // 取消已经被其他选择的实验勾选
                            for (var i = 0, len = beenChoosed.length; i < len; i++) {
                                var whereIS = getIndexOfId(beenChoosed[i].expItemId);
                                $scope.labItems[whereIS].isChecked = false;
                                var option = {
                                    title: '删除失败',
                                    content: beenChoosed[i].name + ' 已经有学生选择该实验',
                                    type: 'warning',
                                    duration: 5
                                };
                                Alert.show(option);
                            }
                            // 取消已经被其他老师引用的实验勾选
                            for (var i = 0, len = beenRefed.length; i < len; i++) {
                                var whereIS = getIndexOfId(beenRefed[i].expItemId);
                                $scope.labItems[whereIS].isChecked = false;
                                var option = {
                                    title: '删除失败',
                                    content: beenRefed[i].name + ' 已经有老师选择该实验',
                                    type: 'warning',
                                    duration: 5
                                };
                                Alert.show(option);
                            }
                            // 删除允许被删除的实验
                            for (var i = 0, len = hasDeleted.length; i < len; i++) {
                                var whereIS = getIndexOfId(hasDeleted[i].expItemId);
                                $scope.labItems.splice(whereIS, 1);
                                var option = {
                                    content: hasDeleted[i].name + '　成功删除',
                                    duration: 5
                                };
                                Alert.show(option);
                            }
                            // 隐藏模态框
                            // 清空checked item index array
                            labItemsArray = [];
                            $scope.checkedLen = 0;
                        }, function(response) {
                            // 请求失败
                            console.error(response);
                        });
                };
            };
        }
    ]);
