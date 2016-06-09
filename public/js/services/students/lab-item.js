// 学生界面 -- 获取实验列表
angular.module('myApp')
    .factory('LabItem', ['$http', '$q', function($http, $q) {
        var getLabItems = function(url, data) {
            var deferred = $q.defer();
            var request = {
                url: url,
                method: 'GET',
                params: data
            }
            $http(request)
                .then(function(response) {
                    // 请求成功
                    deferred.resolve(response);
                }, function(response) {
                    // 请求失败
                    if (response.data.isLoggedOut) {
                        // token过期, 
                        location.href = '/login.html';
                    }
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        return {
            get: getLabItems
        };
    }]);
