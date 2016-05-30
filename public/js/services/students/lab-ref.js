// 学生界面 -- 获取某实验的引用列表
angular.module('myApp')
    .factory('LabRef', ['$http', '$q', function($http, $q) {
        var getLabRef = function(expItemId) {
            var deferred = $q.defer();
            var url = '/student/get-lab-ref/' + expItemId;
            $http.get(url)
                .then(function(response) {
                    // 请求成功
                    if (response.data.success) {
                        deferred.resolve(response);
                    } else {
                        deferred.reject(response);
                    }
                }, function(response) {
                    // 请求失败
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        var hasChoosedThisLab = function(expItemId) {
            var deferred = $q.defer();
            var url = '/student/has-choosed-this-lab/' + expItemId;
            $http.get(url)
                .then(function(response) {
                    // 请求成功
                    if (response.data.success) {
                        deferred.resolve(response);
                    } else {
                        deferred.reject(response);
                    }
                }, function(response) {
                    // 请求失败
                    deferred.reject(response);
                });
            return deferred.promise;
        }

        return {
            get: getLabRef,
            hasChoosed: hasChoosedThisLab
        };
    }])
