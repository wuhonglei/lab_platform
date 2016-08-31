angular.module('myApp')
    .factory('Password', ['$http', '$q', function($http, $q) {
        var modifyPassword = function(password) {
            var deferred = $q.defer();
            var url = '/user/modify-password';
            var data = { password: JSON.stringify(password) };
            $http.put(url, data)
                .then(function(response) {
                    if (response.data.success) {
                        deferred.resolve(response);
                    } else {
                        deferred.reject(response);
                    }
                }, function(response) {
                    if (response.data.isLoggedOut) {
                        // token过期, 
                        location.href = '/login.html';
                    }
                    deferred.reject(response);
                });
            return deferred.promise;
        };

        return {
            modify: modifyPassword
        };
    }]);
