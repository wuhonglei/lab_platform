angular.module('myApp')
    .factory('PersonalInfo', ['$window', function($window) {
        var info = (function() {
            var token = $window.localStorage['token'];
            payload = token.split('.')[1];
            payload = decodeURIComponent(escape($window.atob(payload)));
            payload = JSON.parse(payload);
            return {
                name: $window.localStorage.name,
                number: payload.number
            };
        })();
        return info;
    }])
