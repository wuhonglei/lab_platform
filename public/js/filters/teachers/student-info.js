// 老师界面 -- 过滤学生信息
angular.module('myApp')
    .filter('infoFilter', function() {
        return function(infoList, search) {
            var shouldPass = {};
            // 是否需要过滤
            var notFilter = false;
            for (var key in search) {
                if (search[key] != undefined) {
                    notFilter = true;
                    shouldPass[key] = search[key];
                }
            }
            // 不需要过滤
            if (!notFilter) {
                return infoList;
            }

            // 存放最后返回的元素
            var out = [];
            angular.forEach(infoList, function(item, index) {
                var notPush = false;
                for (var key in shouldPass) {
                    if (shouldPass[key] !== item[key]) {
                        notPush = true;
                        break;
                    }
                }
                // 满足过滤规则
                if (!notPush) out.push(item);
            });
            return out;
        };
    });
