// 学生界面 -- 向服务器请求实验详情
angular.module('myApp')
    .factory('LabDetail', ['$http', '$q', function($http, $q) {
        var getLabDetail = function(expItemId) {
            var deferred = $q.defer();
            var url = '/student/get-detail/' + expItemId;
            $http.get(url)
                .then(function(response) {
                    // 请求成功
                    deferred.resolve(response);
                }, function(response) {
                    // 请求失败
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        return {
            get: getLabDetail
        };
    }]);
