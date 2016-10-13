// 教师界面 -- 上传, 修改, 删除学生信息
angular.module('myApp')
    .factory('StudentInfo', ['$http', '$q',
        function($http, $q) {
            // 保存信息表
            var save = function(data) {
                var deferred = $q.defer();
                var request = {
                    method: 'POST',
                    url: '/teacher/upload-student-info',
                    data: data
                };
                // 或者使用 $http.post(url, data)
                $http(request).then(function(response) {
                    // 请求成功
                    deferred.resolve(response);
                }, function(response) {
                    // 请求失败
                    var message = {};
                    var errmsg = response.data.message.errmsg;
                    var regExp = /description_1 dup key/;
                    if (regExp.test(errmsg)) {
                        message.errmsg = "该表格已经上传过, 不能重复上传";
                    } else {
                        message.errmsg = errmsg;
                    }
                    message.description = response.data.description;
                    response.data = message;
                    deferred.reject(response);
                });
                return deferred.promise;
            };

            // 获取学生信息表
            var get = function() {
                var deferred = $q.defer();
                var url = '/teacher/get-student-info';
                $http.get(url).then(function(response) {
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

            return {
                save: save,
                get: get
            };
        }
    ]);
