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

            // 获取可以选择的班级列表
            var postMultiLabs = function(labDetail) {
                var deferred = $q.defer();
                if (!labDetail) {
                    var error = {
                        success: false,
                        message: "请求错误"
                    };
                    deferred.reject(error);
                } else {
                    if (!labDetail.description) {
                        deferred.reject(error);
                    }
                    var data = {
                        description: labDetail.description,
                        expItemId: labDetail.expItemId,
                        labName: labDetail.labName,
                        number: PersonalInfo.number,
                        name: PersonalInfo.name
                    };
                    var url = "/teacher/post-multi-work";
                    $http.post(url, data).then(function(response) {
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
                }
                return deferred.promise;
            };

            return {
                get: getLabDetail,
                update: updateLabDetail,
                postWork: postMultiLabs
            };
        }
    ])
