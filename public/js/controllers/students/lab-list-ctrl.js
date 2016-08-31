// 左侧导航栏
angular.module('myApp')
    .controller('CategoryNavCtrl', ['$scope', '$routeParams', 'LabItem', 'Sidebar',
        function($scope, $routeParams, LabItem, Sidebar) {
            // 获取访问的实验类目
            var category = $routeParams.categoryID;
            $scope.navName = Sidebar.name(category);
            $scope.labItems = [];
            $scope.totalItems = 0;
            // display 5 items one page
            $scope.itemPerPage = 5;
            $scope.currentPage = 1;

            var url;
            if (category != 'my-labs') {
                url = '/student/' + category + '/get-items';
            } else {
                url = '/student/get-personal-labs';
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
        }
    ]);
