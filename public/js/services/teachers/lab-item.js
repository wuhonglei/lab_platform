// 老师界面 -- 实验列表服务
angular.module('myApp')
    .factory('LabItem', ['$http', '$q', 'Upload', 'PersonalInfo',
        function($http, $q, Upload, PersonalInfo) {
            var getLabItems = function(category) {
                var url = '/teacher/' + category + '/get-items';
                var deferred = $q.defer();
                $http.get(url)
                    .then(function(response) {
                        // 请求成功
                        var data = response.data.labItems;
                        for (var i = 0, len = data.length; i < len; i++) {
                            data[i].isEditable = (data[i].createdByNumber === PersonalInfo.number);
                            data[i].isChecked = false;
                        }
                        response.data.labItems = data;
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

            // 添加实验item
            var saveLabItem = function(data) {
                var deferred = $q.defer();
                var url = '/teacher/create-item';
                var upload = Upload.upload({
                    url: url,
                    data: data
                });
                upload
                    .then(function(response) {
                        // file is uploaded successfully
                        response.data.labItem.isEditable = true;
                        response.data.labItem.isChecked = false;
                        deferred.resolve(response);
                    }, function(response) {
                        // handle error
                        deferred.reject(response);
                    });
                return deferred.promise;
            };

            // 更新实验item
            var updateLabItem = function(originItem, curItem) {
                var deferred = $q.defer();
                // 判断该用户是否是这个实验的原始创建者
                if (originItem.createdByNumber != PersonalInfo.number) {
                    deferred.reject({
                        data: {
                            success: false,
                            message: "你无权修改该实验"
                        }
                    });
                } else {
                    var url = '/teacher/update-item';
                    var keyArr = ['name', 'description'];
                    var data = { length: 0 };
                    for (var i = 0, len = keyArr.length; i < len; i++) {
                        if (originItem[keyArr[i]] != curItem[keyArr[i]]) {
                            data[keyArr[i]] = curItem[keyArr[i]];
                            data.length++;
                        }
                    }
                    if (curItem.image != undefined) {
                        data['image'] = curItem.image;
                        data.length++;
                    }
                    if (data.length > 0) {
                        data.expItemId = originItem.expItemId;
                        data.createdByNumber = PersonalInfo.number;
                        delete data['length'];
                        var upload = Upload.upload({
                            url: url,
                            data: data,
                            method: 'PUT'
                        });
                        upload.then(function(response) {
                            // file is uploaded successfully
                            if (response.data.success) {
                                var update = response.data.labItem;
                                response.data = {
                                    success: true,
                                    update: update
                                };
                                deferred.resolve(response);
                            } else {
                                response.data = {
                                    success: false,
                                    message: "项目内容修改失败"
                                };
                                deferred.reject(response);
                            }
                        }, function(response) {
                            // handle error
                            deferred.reject(response);
                        });
                    } else {
                        var response = {};
                        response.data = {
                            success: false,
                            message: "项目内容没有修改"
                        };
                        deferred.reject(response);
                    }
                }
                return deferred.promise;
            };

            // 删除实验条目
            var deleteLabItems = function(expItemIdArray) {
                var deferred = $q.defer();
                var url = '/teacher/delete-labs/' + JSON.stringify(expItemIdArray);
                $http.delete(url)
                    .then(function(response) {
                        // 请求成功
                        if (response.data.success) {
                            // delete response.data['success'];
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
                get: getLabItems,
                save: saveLabItem,
                update: updateLabItem,
                delete: deleteLabItems
            };
        }
    ])
