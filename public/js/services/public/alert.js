// 显示警告框服务
angular.module('myApp')
    .factory('Alert', ['$alert', function($alert) {
        var showAlert = function(option) {
            if (option === undefined) {
                option = {};
            }
            title = option.title || '';
            content = option.content || '执行成功';
            container = option.container || '#alertContainer';
            type = option.type || 'success';

            // 配置项
            var alertOption = {
                title: title,
                content: content,
                container: container,
                type: type,
                duration: 3,
                show: false
            };

            // 初始化配置项
            var myAlert = $alert(alertOption);

            // 显示模态框
            myAlert.$promise.then(myAlert.show);
        };

        return {
            show: showAlert
        };
    }]);
