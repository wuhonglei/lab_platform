// 公共界面 -- 导航栏
angular.module('myApp')
    .factory('Sidebar', ['$http', function($http) {
        // 获取登陆者身份
        var identity = localStorage.identity;
        // 侧边导航栏类目
        var sidebarData = function() {
            // 学生和老师共同部分
            var categoryBase = [
                { label: '软件安全', select: 'software-security-labs' },
                { label: '网络安全', select: 'network-security-labs' },
                { label: 'web安全', select: 'web-security-labs' },
                { label: '系统安全', select: 'system-security-labs' },
                { label: '密码学', select: 'cryptography-labs' },
                { label: '移动安全', select: 'mobile-security-labs' },
                { label: '实验资源', select: 'lab-resource' }
            ];
            // 学生部分
            var categoryStu = [
                { label: '我的成绩', select: 'my-grades' }
                // { label: '我的实验', select: 'my-labs' }
            ];
            // 老师部分
            var categoryTea = [
                { label: '学生成绩', select: 'student-grades' },
                { label: '学生信息', select: 'student-info' },
                { label: '我的实验', select: 'my-labs' }
            ];
            if (identity == 'student') {
                return categoryStu.concat(categoryBase);
            } else {
                return categoryTea.concat(categoryBase);
            }
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
