// 教师界面 -- 显示选择该老师的学生列表
angular.module('myApp')
    .factory('Student', ['$http', '$q', function($http, $q) {
        // 获取该学生选择的实验列表
        var getStudentList = function(selected) {
            var deferred = $q.defer();
            var url = '/teacher/get-choosed-lab/' + JSON.stringify(selected);
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

        // 老师打分
        var markScore = function(data) {
            var deferred = $q.defer();
            var url = '/teacher/mark-lab';
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

        return {
            getList: getStudentList,
            mark: markScore
        };
    }]);
