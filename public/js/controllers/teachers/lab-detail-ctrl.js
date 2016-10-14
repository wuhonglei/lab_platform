   angular.module('myApp')
       .config(function($provide) {
           $provide.decorator('taOptions', ['taRegisterTool', '$uibModal', '$delegate',
               function(taRegisterTool, $uibModal, taOptions) {
                   // $delegate is the taOptions we are decorating
                   // register the tool with textAngular
                   // 
                   taRegisterTool('backgroundColor', {
                       display: "<div spectrum-colorpicker class='btn-xs' ng-model='color' on-change='!!color && action(color)' format='\"hex\"' options='options'></div>",
                       action: function(color) {
                           var me = this;
                           if (!this.$editor().wrapSelection) {
                               setTimeout(function() {
                                   me.action(color);
                               }, 100)
                           } else {
                               return this.$editor().wrapSelection('backColor', color);
                           }
                       },
                       options: {
                           replacerClassName: 'fa fa-paint-brush',
                           showButtons: false
                       },
                       color: "#fff"
                   });
                   // 字体颜色
                   taRegisterTool('fontColor', {
                       display: "<spectrum-colorpicker class='btn-xs' trigger-id='{{trigger}}' ng-model='color' on-change='!!color && action(color)' format='\"hex\"' options='options'></spectrum-colorpicker>",
                       action: function(color) {
                           var me = this;
                           if (!this.$editor().wrapSelection) {
                               setTimeout(function() {
                                   me.action(color);
                               }, 100)
                           } else {
                               return this.$editor().wrapSelection('foreColor', color);
                           }
                       },
                       options: {
                           replacerClassName: 'fa fa-font',
                           showButtons: false
                       },
                       color: "#000"
                   });
                   // 字体大小
                   taRegisterTool('fontSize', {
                       display: "<span class='bar-btn-dropdown dropdown'>" +
                           "<button class='btn btn-xs btn-blue dropdown-toggle' type='button' ng-disabled='showHtml()'><i class='fa fa-text-height'></i><i class='fa fa-caret-down'></i></button>" +
                           "<ul class='dropdown-menu'><li ng-repeat='o in options'><button class='btn btn-xs btn-blue checked-dropdown' style='font-size: {{o.css}}; width: 100%' type='button' ng-click='action($event, o.value)'><i ng-if='o.active' class='fa fa-check'></i> {{o.name}}</button></li></ul>" +
                           "</span>",
                       action: function(event, size) {
                           //Ask if event is really an event.
                           if (!!event.stopPropagation) {
                               //With this, you stop the event of textAngular.
                               event.stopPropagation();
                               //Then click in the body to close the dropdown.
                               $("body").trigger("click");
                           }
                           return this.$editor().wrapSelection('fontSize', parseInt(size));
                       },
                       options: [
                           { name: 'xx-small', css: 'xx-small', value: 1 },
                           { name: 'x-small', css: 'x-small', value: 2 },
                           { name: 'small', css: 'small', value: 3 },
                           { name: 'medium', css: 'medium', value: 4 },
                           { name: 'large', css: 'large', value: 5 },
                           { name: 'x-large', css: 'x-large', value: 6 },
                           { name: 'xx-large', css: 'xx-large', value: 7 }

                       ]
                   });
                   // upload image
                   taRegisterTool('uploadImage', {
                       buttontext: 'Upload Image',
                       iconclass: "fa fa-image",
                       action: function(deferred, restoreSelection) {
                           $uibModal.open({
                               controller: 'UploadImageModalInstance',
                               templateUrl: 'partials/teacher/lab-detail-upload-image-modal.html'
                           }).result.then(
                               function(result) {
                                   // upload success
                                   restoreSelection();
                                   document.execCommand('insertImage', true, result);
                                   deferred.resolve();
                               },
                               function() {
                                   // upload failed
                                   deferred.resolve();
                               }
                           );
                           return false;
                       }
                   });
                   // upload file
                   taRegisterTool('uploadFile', {
                       buttontext: 'Upload File',
                       iconclass: "fa fa-file",
                       action: function(deferred, restoreSelection) {
                           $uibModal.open({
                               controller: 'UploadFileModalInstance',
                               templateUrl: 'partials/teacher/lab-detail-upload-files-modal.html'
                           }).result.then(
                               function(result) {
                                   // upload success
                                   restoreSelection();
                                   document.execCommand('createLink', true, result);
                                   deferred.resolve();
                               },
                               function() {
                                   // upload failed
                                   deferred.resolve();
                               }
                           );
                           return false;
                       }
                   });

                   taOptions.toolbar[3].splice(1, 0, 'uploadImage');
                   taOptions.toolbar[3].splice(3, 0, 'uploadFile');
                   taOptions.toolbar[1].push('backgroundColor', 'fontColor', 'fontSize');
                   return taOptions;
               }
           ]);
       })
       // 图片上传
       .controller('UploadImageModalInstance', ['$scope', '$uibModalInstance', 'Upload',
           function($scope, $uibModalInstance, Upload) {

               $scope.upload = function() {
                   if (!!$scope.file) {

                       Upload.upload({
                           url: '/teacher/upload-image',
                           data: { image: $scope.file }
                       }).then(function(response) {
                           // post success
                           $scope.image = response.data.image;
                       }, function(response) {
                           // post failed 
                       });
                   }
               };

               $scope.insert = function() {
                   $uibModalInstance.close($scope.image);
               };
           }
       ])
       // 文件上传
       .controller('UploadFileModalInstance', ['$scope', '$uibModalInstance', 'Upload',
           function($scope, $uibModalInstance, Upload) {
               var filename;
               $scope.upload = function() {
                   if (!!$scope.file) {
                       Upload.upload({
                           url: '/teacher/upload-file',
                           data: { file: $scope.file }
                       }).then(function(response) {
                           // post success
                           $scope.filename = $scope.file.name;
                           filename = response.data.file;
                       }, function(response) {
                           // post failed 
                       });
                   }
               };

               $scope.insert = function() {
                   $uibModalInstance.close(filename);
               };
           }
       ])
       .controller('LabDetailCtrl', ['$scope', '$routeParams', '$filter', 'LabDetail', 'LabRef', 'Alert', 'StudentInfo', '$http',
           function($scope, $routeParams, $filter, LabDetail, LabRef, Alert, StudentInfo, $http) {
               var createdByNumber;
               var originHtml;
               var detail;
               // 获取实验详情
               LabDetail.get($routeParams.expItemId)
                   .then(function(response) {
                       // 请求成功
                       if (response.data.success) {
                           detail = response.data;
                           $scope.htmlVariable = detail.labDetail;
                           $scope.isEditable = detail.isEditable;
                           $scope.labName = detail.labName;
                           createdByNumber = detail.createdByNumber;
                           originHtml = detail.labDetail;
                       }
                   }, function(response) {
                       // 请求失败
                       console.error(response);
                   });

               // 获取范文的实验类目及该类目下具体的实验项
               $scope.isEdit = $scope.isEditing = false;
               // 按钮状态变换
               $scope.toggleEdit = function(event) {
                   // 点击编辑按钮
                   var curDom = event.target;
                   var value = $(curDom).text();
                   var obj = {
                       '编辑': {
                           'value': '保存',
                           'removeClass': 'btn btn-parimary',
                           'addClass': 'btn btn-success'
                       },
                       '保存': {
                           'value': '编辑',
                           'removeClass': 'btn btn-success',
                           'addClass': 'btn btn-parimary'
                       }
                   };

                   $(curDom).text(obj[value].value);
                   $(curDom).removeClass(obj[value].removeClass);
                   $(curDom).addClass(obj[value].addClass);
                   $scope.isEditing = !$scope.isEditing;
                   $scope.isEdit = $scope.isEditing;
                   if (value === '保存' && originHtml != $scope.htmlVariable) {
                       LabDetail.update($routeParams.expItemId, $scope.htmlVariable, createdByNumber)
                           .then(function(response) {
                               // 请求成功
                               if (response.data.success) {
                                   originHtml = $scope.htmlVariable;
                                   Alert.show({
                                       content: '保存成功',
                                       container: '#detail-alert-container'
                                   });
                               } else {
                                   $scope.htmlVariable = originHtml;
                               }
                           }, function(response) {
                               $scope.htmlVariable = originHtml;
                           });
                   }
               };

               // 如果实验不可编辑(不是由自己创建的实验, 不能编辑)
               if (!$scope.isEditable) {
                   // 判断该实验是否被该老师引用
                   LabRef.hasRefed($routeParams.expItemId)
                       .then(function(response) {
                           // 请求成功
                           $scope.hasRefed = response.data.hasRefed;
                       }, function(response) {
                           // 请求失败
                       });

                   // 引用该实验
                   $scope.refLab = function() {
                       LabRef.create($routeParams.expItemId)
                           .then(function(response) {
                               // 请求成功
                               $scope.hasRefed = true;
                               $('#refLabModal').modal('hide');
                               Alert.show({
                                   content: '实验引用成功',
                                   container: '#detail-alert-container'
                               });
                           }, function(response) {
                               // 请求失败
                               console.error(response);
                               $('#refLabModal').modal('hide');
                               var option = {
                                   content: '实验引用失败',
                                   container: '#detail-alert-container',
                                   type: 'warning'
                               };
                               Alert.show(option);
                           });
                   };

                   // 解除引用
                   $scope.disRefLab = function() {
                       LabRef.delete($routeParams.expItemId)
                           .then(function(response) {
                               // 请求成功
                               $scope.hasRefed = false;
                               $('#disRefLabModal').modal('hide');
                               Alert.show({
                                   content: '实验引用解除成功',
                                   container: '#detail-alert-container'
                               });
                           }, function(response) {
                               // 请求失败
                               console.error(response);
                               $('#disRefLabModal').modal('hide');
                               if (response.data.beenChoosed) {
                                   // 该实验已经有学生选择
                                   var option = {
                                       title: '注意',
                                       content: '已经有学生选择该实验,你无法删除',
                                       container: '#detail-alert-container',
                                       type: 'warning'
                                   };
                                   Alert.show(option);
                               }
                           });
                   };

                   // 获取班级列表
                   $scope.descriptions = undefined;
                   (function getClassDescriptions() {
                       var url = '/teacher/get-select-list';
                       $http.get(url).then(function(response) {
                           /* body... */
                           if (response.data.success) {
                               var data = response.data.infoList;
                               $scope.descriptions = data.descriptions;
                           }
                       }, function(response) {
                           /* body... */
                       });
                   })();

                   // 批量布置作业
                   $scope.postWork = function(description) {
                       detail.description = description;
                       LabDetail.postWork(detail).then(function(response) {
                           // 请求成功
                           Alert.show({ content: '批量布置成功' });
                       }, function(response) {
                           // 请求失败
                           Alert.show({ content: '批量布置失败', type: 'danger' });
                       });
                       $("#modal-post-work").modal('hide');
                   };
               }
           }
       ]);
