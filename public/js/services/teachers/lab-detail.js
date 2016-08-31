// 教师界面 -- 实验详情 service
angular.module('myApp')
    .factory('LabDetail', ['$http', '$q', 'PersonalInfo',
        function($http, $q, PersonalInfo) {
            // 获取实验详情
            var getLabDetail = function(expItemId) {
                var deferred = $q.defer();
                var url = '/teacher/get-detail/' + expItemId;
                $http.get(url)
                    .then(function(response) {
                        // 请求成功
                        response.data = response.data.labDetail;
                        response.data.isEditable = (response.data.createdByNumber === PersonalInfo.number);
                        response.data.success = true;
                        deferred.resolve(response);
                    }, function(response) {
                        // 请求失败
                        response.data = {
                            success: false,
                            message: "实验详情请求失败"
                        };
                        deferred.reject(response);
                    });
                return deferred.promise;
            };

            // 更新实验详情
            var updateLabDetail = function(expItemId, labDetail, createdByNumber) {
                var deferred = $q.defer();
                var url = '/teacher/update-detail';
                var data = {
                    expItemId: expItemId,
                    labDetail: labDetail,
                    createdByNumber: createdByNumber
                };
                $http.put(url, data)
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
                get: getLabDetail,
                update: updateLabDetail
            };
        }
    ])
