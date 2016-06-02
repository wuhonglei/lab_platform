// 学生界面 -- 选择某实验后在首页显示学生所选取实验列表
angular.module('myApp')
    .factory('labPost', ['$http', '$q', 'PersonalInfo', 'Upload',
        function($http, $q, PersonalInfo, Upload) {
            // 新建实验列表
            var createLabPost = function(labRef, selectTeacher) {
                var deferred = $q.defer();
                var url = '/student/choose-lab';
                var data = {
                    expItemId: labRef.expItemId,
                    labName: labRef.labName,
                    studentName: PersonalInfo.name,
                    studentNumber: PersonalInfo.number,
                    teacherName: selectTeacher.name,
                    teacherNumber: selectTeacher.number
                };
                // 学生实验后, 建立学生和老师之间的关系
                $http.post(url, data)
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

            // 获取学生选择的实验列表
            var getLabPost = function() {
                var deferred = $q.defer();
                var url = '/student/get-choosed-lab';
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

            // 上传pdf
            var uploadPdf = function(data) {
                var deferred = $q.defer();
                var url = '/student/post-lab-pdf';
                Upload.upload({
                    url: url,
                    method: 'PUT',
                    data: data
                }).then(function(response) {
                    // file is uploaded successfully
                    if (response.data.success) {
                        deferred.resolve(response);
                    } else {
                        deferred.reject(response);
                    }
                }, function(response) {
                    // handle error
                    deferred.reject(response);
                });

                return deferred.promise;
            };

            return {
                create: createLabPost,
                uploadPdf: uploadPdf,
                get: getLabPost
            };

        }
    ]);
