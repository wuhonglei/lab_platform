// 学生界面 -- 获取实验列表
angular.module('myApp')
    .factory('LabItem', ['$http', '$q', function($http, $q) {
        var getLabItems = function(category) {
            var url = '/student/' + category + '/get-items';
            var deferred = $q.defer();
            $http.get(url)
                .then(function(response) {
                    // 请求成功
                    response.data = {
                        success: true,
                        labItems: response.data.labItems
                    };
                    deferred.resolve(response);
                }, function(response) {
                    // 请求失败
                    response.data = {
                        success: false,
                        message: "实验列表获取失败"
                    };
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        return {
            get: getLabItems
        };
    }]);
