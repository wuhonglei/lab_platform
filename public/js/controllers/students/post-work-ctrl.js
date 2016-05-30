// 学生界面 -- 上传作业控制器
angular.module('myApp')
    .controller('PostWorkCtrl', ['$scope', 'PreviewPDF', function($scope, PreviewPDF) {
        // 预览PDF文件
        $scope.viewPdfFile = function() {
            PreviewPDF.view();
        };
    }]);
