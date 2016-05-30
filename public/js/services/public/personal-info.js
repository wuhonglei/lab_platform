angular.module('myApp')
    .factory('PersonalInfo', ['$window', function($window) {
        var info = (function() {
            var token = $window.sessionStorage['token'];
            payload = token.split('.')[1];
            payload = decodeURIComponent(escape($window.atob(payload)));
            payload = JSON.parse(payload);
            return {
                name: payload.name,
                number: payload.number
            };
        })();

        return info;
    }])
