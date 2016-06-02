angular.module('myApp')
    .factory('Authentication', ['$http', '$window', function($http, $window) {
        var saveToken = function(token) {
            $window.sessionStorage['token'] = token;
            payload = token.split('.')[1];
            payload = $window.atob(payload);
            payload = JSON.parse(payload);
            $window.sessionStorage['identity'] = payload.isTeacher ? 　'teacher' : 'student';
        };

        var getToken = function() {
            return $window.sessionStorage['token'];
        };

        var logout = function() {
            $window.sessionStorage.removeItem('token');
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
