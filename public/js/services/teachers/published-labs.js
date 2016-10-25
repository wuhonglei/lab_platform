// 教师界面 -- 已布置实验 -- 存储需要打分的班级信息
angular.module('myApp')
    .factory('PublishedLabs', ['$window', function($window) {
        // 从'已布置实验界面' -跳转- '打分', 存储相关的过滤值
        var jump2Grade = function(data) {
            var value = {
                year: data.year,
                course: data.course,
                className: data.class,
                labName: data.labName
            };
            $window.localStorage.selected = JSON.stringify(value);
            location.href = "#/grade-labs";
        };

        // '打分界面' 获取过滤值
        var getSelected = function() {
            var data = JSON.parse($window.localStorage.selected);
            $window.localStorage.selected = JSON.stringify({});
            return (Object.keys(data).length) ? data : false;
        };

        return {
            jump: jump2Grade,
            getSelected: getSelected
        };
    }]);
