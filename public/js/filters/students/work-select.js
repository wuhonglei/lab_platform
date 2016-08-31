// 学生界面 -- 过滤已提交的作业或未提交的作业
angular.module('myApp')
    .filter('tableFilter', function() {
        return function(tableItems, search) {
            if (search == undefined) {
                return tableItems
            }
            // 存放最后返回的元素
            var out = [];
            var filter = {
                isPost: undefined,
                isMarked: undefined
            };
            // 将 search 转换为数字
            search = (+search);
            if (search <= 2) {
                filter.isPost = (search == 1);
                filter.isMarked = undefined;
            } else {
                filter.isMarked = (search == 3);
                filter.isPost = undefined;
            }

            // 对数组中, isPost  进行遍历
            angular.forEach(tableItems, function(item, index) {
                if (item.isPost == filter.isPost || item.isMarked == filter.isMarked) {
                    out.push(item);
                }
            });

            return out;
        };
    });
