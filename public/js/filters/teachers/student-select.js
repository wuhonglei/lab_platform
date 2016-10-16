// 老师界面 -- 过滤已提交的作业或未提交的作业
angular.module('myApp')
    .filter('tableFilter', function() {
        return function(tableItems, search) {
            if (Object.keys(search).length == 0) {
                return tableItems
            }
            var out = [];
            angular.forEach(tableItems, function(item, index) {
                var isOK = true;
                for (var key in search) {
                    if (item[key] != search[key]) {
                        isOK = false;
                        break;
                    }
                }
                if (isOK) {
                    out.push(item);
                }
            });
            return out;
        };
    });
