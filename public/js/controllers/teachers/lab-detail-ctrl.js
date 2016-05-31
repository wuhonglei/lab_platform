   angular.module('myApp')
       .config(function($provide) {
           $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions) {
               // $delegate is the taOptions we are decorating
               // register the tool with textAngular

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


               // add the button to the default toolbar definition
               taOptions.toolbar[1].push('backgroundColor', 'fontColor', 'fontSize');
               return taOptions;
           }]);
       })
       .controller('LabDetailCtrl', ['$scope', '$routeParams', '$filter', 'LabDetail', 'LabRef',
           function($scope, $routeParams, $filter, LabDetail, LabRef) {
               var createdByNumber;
               var originHtml;
               // 获取实验详情
               LabDetail.get($routeParams.expItemId)
                   .then(function(response) {
                       // 请求成功
                       if (response.data.success) {
                           $scope.htmlVariable = response.data.labDetail;
                           $scope.isEditable = response.data.isEditable;
                           createdByNumber = response.data.createdByNumber;
                           originHtml = response.data.labDetail;
                       }
                   }, function(response) {
                       // 请求失败
                       console.error(response);
                   });

               // 获取范文的实验类目及该类目下具体的实验项
               $scope.isEditing = false;
               // 按钮状态变换
               $scope.toggleEdit = function(event) {
                   // 点击编辑按钮
                   var curDom = event.target;
                   var value = $(curDom).text();
                   var obj = {
                       '编辑': {
                           'value': '保存',
                           'removeClass': 'btn btn-parimary',
                           'addClass': 'btn btn-success',
                           'contenteditable': true
                       },
                       '保存': {
                           'value': '编辑',
                           'removeClass': 'btn btn-success',
                           'addClass': 'btn btn-parimary',
                           'contenteditable': false
                       }
                   };

                   $(curDom).text(obj[value].value);
                   $(curDom).removeClass(obj[value].removeClass);
                   $(curDom).addClass(obj[value].addClass);
                   $scope.isEditing = !$scope.isEditing;
                   if (value === '保存' && originHtml != $scope.htmlVariable) {
                       LabDetail.update($routeParams.expItemId, $scope.htmlVariable, createdByNumber)
                           .then(function(response) {
                               // 请求成功
                               if (response.data.success) {
                                   originHtml = $scope.htmlVariable;
                               } else {
                                   $scope.htmlVariable = originHtml;
                               }
                           }, function(response) {
                               $scope.htmlVariable = originHtml;
                           });
                   }
               };

               // 如果实验不可编辑(不是由自己创建的创建, 不能编辑)
               if (!$scope.isEditable) {
                   // 判断该实验是否被该老师引用
                   LabRef.hasRefed($routeParams.expItemId)
                       .then(function(response) {
                           // 请求成功
                           $scope.hasRefed = response.data.hasRefed;
                       }, function(response) {
                           // 请求失败
                       });

                   $scope.refLab = function() {
                       LabRef.create($routeParams.expItemId)
                           .then(function(response) {
                               // 请求成功
                               $scope.hasRefed = true;
                               $('#refLabModal').modal('hide');
                           }, function(response) {
                               // 请求失败
                               console.error(response);
                           });
                   };

                   $scope.disRefLab = function() {
                       LabRef.delete($routeParams.expItemId)
                           .then(function(response) {
                               // 请求成功
                               $scope.hasRefed = false;
                               $('#disRefLabModal').modal('hide');
                           }, function(response) {
                               // 请求失败
                               console.error(response);
                           });
                   };

               }
           }
       ]);
