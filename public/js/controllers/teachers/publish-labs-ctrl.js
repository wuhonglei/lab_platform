 // 教师界面 -- 实验列表
 angular.module('myApp')
     .controller('publishLabsCtrl', ['$scope', 'LabItem', 'Alert', 'Sidebar', '$http', 'LabDetail',
         function($scope, LabItem, Alert, Sidebar, $http, LabDetail) {
             $scope.currentPage = 1;
             $scope.itemPerPage = 5;
             $scope.checkedLen = 0;
             $scope.descriptions = undefined;
             var labItemsArray = new Array();
             var hasLoaded = false;

             // 获取实验列表 
             var getResultsPage = function(newPage) {
                 var data = {
                     limit: $scope.itemPerPage,
                     pageNumber: newPage
                 };
                 var url = '/teacher/get-personal-labs';
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
                 console.log(labItemsArray);
                 console.log('index: ', index);
                 if (index != -1) {
                     $scope.labItems = JSON.parse(labItemsArray[index]).labItems;
                 } else {
                     // 请求新的 items 内容
                     getResultsPage(newPageNumber);
                 }
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

             // 解析每个实验的中文类名
             $scope.categoryLabel = function(select) {
                 return Sidebar.name(select);
             };

             // 布置实验
             $scope.getPublishClass = function(checkedLen) {
                 if (checkedLen <= 0) {
                     $('modal-publish-labs').modal('hide');
                     return;
                 }
                 if (!hasLoaded) {
                     // 获取班级列表信息
                     var url = '/teacher/get-select-list';
                     $http.get(url).then(function(response) {
                         if (response.data.success) {
                             var data = response.data.infoList;
                             $scope.descriptions = data.descriptions;
                             hasLoaded = true;
                         }
                     }, function(response) {
                         /* body... */
                     });
                 }
             };

             // 给班级布置实验(一个或多个)
             $scope.postWork = function(description, deadline, labItems) {
                 if (!description) {
                     Alert.show({ content: '请选择班级', type: 'danger' });
                     return;
                 }
                 if (!deadline) {
                     Alert.show({ content: '请输入有效的截止时长', type: 'danger' });
                     return;
                 }
                 var length = labItemsArray.length;
                 console.log('长度: ', length);
                 for (var i = 0; i < length; i++) {
                     labItemsArray[i] = JSON.parse(labItemsArray[i]);
                     var index = labItemsArray[i].index;
                     var labItem = labItemsArray[i].labItems[index];
                     labItem.description = description;
                     labItem.deadline = deadline;
                     labItem.labName = labItem.name;
                     if (labItemsArray[i].currentPage == $scope.currentPage) {
                         $scope.labItems[index].isChecked = false;
                     }
                     $("#modal-publish-labs").modal('hide');
                     LabDetail.postWork(labItem).then(function(response) {
                         // 请求成功
                         Alert.show({ content: '批量布置成功' });
                     }, function(response) {
                         // 请求失败
                         if (response.data.message == "已存在") {
                             Alert.show({ content: response.data.labName + '重复布置', type: 'danger' });
                         } else {
                             Alert.show({ content: '批量布置失败', type: 'danger' });
                         }
                     });

                 }
                 labItemsArray = [];
                 $scope.checkedLen = 0;
             };
         }
     ]);
