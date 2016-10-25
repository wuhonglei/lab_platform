// 教师界面: 布置实验
angular.module('myApp')
    .factory('PublishLabs', ['$http', '$q', 'PersonalInfo', function($http, $q, PersonalInfo) {
        // 给班级布置实验(一个或多个)
        var postMultiLabs = function(description, deadline, labItems, INDEX) {
            var length = INDEX.length;
            var postData = [];
            for (var i = 0; i < length; i++) {
                var labItem = labItems[INDEX[i]];
                var obj = {
                    description: description,
                    labCategory: labItem.labCategory,
                    expItemId: labItem.expItemId,
                    labName: labItem.labName,
                    deadline: deadline,
                    number: PersonalInfo.number,
                    name: PersonalInfo.name
                };
                postData.push(obj);
            }
            var url = "";
            var deferred = $q.defer();
            $http.post(url, postData).then(function(response) {
                // 请求成功
            }, function(response) {
                // 请求失败
            });
        };
    }])
