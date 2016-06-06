// 公共界面 -- 导航栏
angular.module('myApp')
    .factory('Sidebar', ['$http', function($http) {
        var sidebarData = function() {
            return categories = [
                { label: '我的实验', select: 'my-labs' },
                { label: '软件安全', select: 'software-security-labs' },
                { label: '网络安全', select: 'network-security-labs' },
                { label: 'web安全', select: 'web-security-labs' }
            ];
        };

        var categoryName = function(select) {
            var categories = sidebarData();
            for (var i = 0, len = categories.length; i < len; i++) {
                if (categories[i].select == select) {
                    return categories[i].label;
                }
            }
        };

        return {
            show: sidebarData,
            name: categoryName
        };
    }]);
