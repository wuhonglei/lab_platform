// 教师界面 -- 给班级已布置的实验
angular.module('myApp')
    .controller('publishedLabsCtrl', ['$scope', '$http', 'PublishedLabs',
        function($scope, $http, PublishedLabs) {
            // 获取给班级已布置的实验列表
            $http.get('/teacher/get-published-labs').then(function(response) {
                // 请求成功
                $scope.publishedList = response.data.labPublishedList;
            }, function(response) {
                // 请求失败
            });

            // 跳转到打分界面
            $scope.jump2Grade = function(data) {
                PublishedLabs.jump(data);
            };
        }
    ]);
