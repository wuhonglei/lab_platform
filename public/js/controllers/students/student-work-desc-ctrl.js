// 学生界面 -- 学生选做实验概览
angular.module('myApp')
    .controller('StudentsWorkDescCtrl', ['$scope', '$http', 'Upload', 'labPost', 'PDF', 
        function($scope, $http, Upload, labPost, PDF) {
            // 获取学生选做实验列表
            labPost.get()
                .then(function(response) {
                    // 请求成功
                    $scope.labs = response.data.labPost;
                }, function(response) {
                    // 请求失败
                    console.error(response);
                });

            // 上传PDF
            $scope.uploadFiles = function(pdf, index) {
                if (pdf != null && pdf.type === "application/pdf") {
                    var data = {
                        pdf: pdf,
                        expItemId: $scope.labs[index].expItemId,
                        studentNumber: $scope.labs[index].studentNumber
                    };
                    labPost.uploadPdf(data)
                        .then(function(response) {
                            // 上传成功
                            $scope.labs[index] = response.data.update;
                        }, function(response) {
                            console.error(response);
                        });
                }
            };

            // 预览PDF
            $scope.previewPDF = function(filename) {
                PDF.view(filename);
            };
        }
    ]);
