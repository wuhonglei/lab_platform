// 公共界面 -- 左侧导航栏
angular.module('myApp')
    .factory('Sidebar', ['$http', function($http) {
        // 获取登陆者身份
        var identity = localStorage.identity;
        // 侧边导航栏类目
        var sidebarData = function() {
            // 学生左侧导航
            var categoryStudent = [{
                firstLevelMenu: "我选择的实验",
                secondLevelMenu: [
                    { label: '实验成绩', select: 'lab-marks' }
                ]
            }, {
                firstLevelMenu: "实验资源",
                secondLevelMenu: [
                    { label: '软件安全', select: 'software-security-labs' },
                    { label: '网络安全', select: 'network-security-labs' },
                    { label: 'web安全', select: 'web-security-labs' },
                    { label: '系统安全', select: 'system-security-labs' },
                    { label: '密码学', select: 'cryptography-labs' },
                    { label: '移动安全', select: 'mobile-security-labs' },
                    { label: '实验工具', select: 'lab-tools' }
                ]
            }, {
                firstLevelMenu: "账户",
                secondLevelMenu: [
                    { label: '修改密码', select: 'account/modify-password' }
                    // { label: '注销', select: 'quote-labs' }
                ]
            }];

            // 老师左侧导航
            var categoryTeacher = [{
                firstLevelMenu: "实验作业管理",
                secondLevelMenu: [
                    { label: '布置实验', select: 'publish-labs' },
                    { label: '已布置实验', select: 'published-labs' },
                    { label: '打分', select: 'grade-labs' }
                ]
            }, {
                firstLevelMenu: "学生信息管理",
                secondLevelMenu: [
                    { label: '导入学生名单', select: 'import-student-info' },
                    { label: '管理学生名单', select: 'manage-student-info' }
                ]
            }, {
                firstLevelMenu: "实验资源管理",
                secondLevelMenu: [
                    { label: '我的实验', select: 'my-labs' },
                    { label: '软件安全', select: 'software-security-labs' },
                    { label: '网络安全', select: 'network-security-labs' },
                    { label: 'web安全', select: 'web-security-labs' },
                    { label: '系统安全', select: 'system-security-labs' },
                    { label: '密码学', select: 'cryptography-labs' },
                    { label: '移动安全', select: 'mobile-security-labs' },
                    { label: '实验工具', select: 'lab-tools' }
                ]
            }, {
                firstLevelMenu: "账户",
                secondLevelMenu: [
                    { label: '修改密码', select: 'account/modify-password' }
                    // { label: '注销', select: 'quote-labs' }
                ]
            }];
            if (identity == 'student') {
                return categoryStudent;
            } else {
                return categoryTeacher;
            }
        };

        // 根据 select 查询对应的label
        var categoryName = function(select) {
            var categories = sidebarData();
            var length = categories.length;
            for (var i = 0; i < length; i++) {
                var menu = categories[i].secondLevelMenu;
                var len = menu.length;
                for (var j = 0; j < len; j++) {
                    if (menu[j].select == select) {
                        return menu[j].label;
                    }
                }
            }
        };

        var labCategory = function() {
            var categories = [
                { label: '软件安全', select: 'software-security-labs' },
                { label: '网络安全', select: 'network-security-labs' },
                { label: 'web安全', select: 'web-security-labs' },
                { label: '系统安全', select: 'system-security-labs' },
                { label: '密码学', select: 'cryptography-labs' },
                { label: '移动安全', select: 'mobile-security-labs' }
            ];
            return categories;
        };

        return {
            categories: labCategory,
            show: sidebarData,
            name: categoryName
        };
    }]);
