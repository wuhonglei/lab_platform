// 左侧导航栏
angular.module('myApp')
    .controller('CategoryNavCtrl', ['$scope', '$routeParams', 'LabItem', 'Sidebar',
        function($scope, $routeParams, LabItem, Sidebar) {
            // 获取访问的实验类目
            var category = $routeParams.categoryID;
            $scope.navName = Sidebar.name(category);
            var url;
            if (category != 'my-labs') {
                url = '/student/' + category + '/get-items';
            } else {
                url = '/student/get-personal-labs';
            }
            LabItem.get(url)
                .then(function(response) {
                    // 请求成功
                    if (response.data.success) {
                        $scope.labItems = response.data.labItems;
                    }
                }, function(response) {
                    // 请求失败
                    console.error(response);
                });
        }
    ]);
