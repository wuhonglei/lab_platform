angular.module('myApp')
    .factory('Authentication', ['$http', '$window', function($http, $window) {
        var saveToken = function(token) {
            $window.localStorage ['token'] = token;
            payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);
            $window.localStorage ['identity'] = payload.isTeacher ? 　'teacher' : 'student';
        };

        var getToken = function() {
            return $window.localStorage ['token'];
        };

        var logout = function() {
            $window.localStorage .removeItem('token');
        };

        var isLoggedIn = function() {
            var token = getToken();
            var payload;

            if (token) {
                payload = token.split('.')[1];
                payload = $window.atob(payload);
                payload = JSON.parse(payload);
                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };
        
        return {
            saveToken: saveToken,
            getToken: getToken,
            logout: logout,
            isLoggedIn: isLoggedIn
        };
    }]);
