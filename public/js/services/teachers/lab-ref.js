// 当该实验不是由自己创建时, 可以引用或解除引用该实验
angular.module('myApp')
    .factory('LabRef', ['$http', '$q', function($http, $q) {
        var hasBeenRefed = function(expItemId) {
            var deferred = $q.defer();
            var url = '/teacher/has-reffed-lab/' + expItemId;
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
                    if (response.data.isLoggedOut) {
                        // token过期, 
                        location.href = '/login.html';
                    }
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        // 引用该实验
        var createRefName = function(expItemId) {
            var deferred = $q.defer();
            var url = '/teacher/createRefName';
            var data = { expItemId: expItemId };
            $http.put(url, data)
                .then(function(response) {
                    // 请求成功
                    if (response.data.success) {
                        deferred.resolve(response);
                    } else {
                        deferred.reject(response);
                    }
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

        // 删除该实验的引用
        var deleteRef = function(expItemId) {
            var deferred = $q.defer();
            var url = '/teacher/deleteRefName/' + expItemId;
            $http.delete(url)
                .then(function(response) {
                    // 请求成功
                    if (response.data.success) {
                        deferred.resolve(response);
                    } else {
                        deferred.reject(response);
                    }
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
            hasRefed: hasBeenRefed,
            create: createRefName,
            delete: deleteRef
        };
    }]);
