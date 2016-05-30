// 左侧导航栏
angular.module('myApp')
    .controller('CategoryNavCtrl', ['$scope', '$routeParams', 'LabItem',
        function($scope, $routeParams, LabItem) {
            // 获取访问的实验类目
            var category = $routeParams.categoryID;
            var labItems = LabItem.get(category);
            labItems.then(function(response) {
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
