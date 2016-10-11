// 根据登陆的身份去加载相应的js文件
// 函数立即执行 
(function loadScript() {
    if (localStorage.token == undefined) {
        // 如果直接通过网站域名访问, 例如: localhost:4040, 这时会跳到登陆页面
        return location.href = '/login.html';
    }
    var identity = localStorage.identity;
    // 定义src对象, 包含相应身份的 js path
    var src = {
        student: [
            'js/public/students-app.js', 'js/services/students/lab-detail.js', 'js/services/students/lab-ref.js',
            'js/services/students/lab-select.js', 'js/services/students/lab-item.js',
            'js/controllers/students/lab-list-ctrl.js', 'js/controllers/students/lab-detail-ctrl.js',
            'js/controllers/students/student-work-desc-ctrl.js', 'js/filters/students/work-select.js'
        ],
        teacher: [
            'js/public/teachers-app.js', 'js/services/teachers/lab-item.js', 'js/services/teachers/lab-detail.js',
            'js/services/teachers/lab-ref.js', 'js/lib/angular-ui-modal/ui-bootstrap-custom-tpls-1.3.3.js',
            'js/services/teachers/lab-select.js', 'js/services/teachers/parse-excel.js',
            'js/controllers/teachers/lab-list-ctrl.js', 'js/controllers/public/lab-resource-ctrl.js', 
            'js/controllers/teachers/student-grade-ctrl.js', 'js/controllers/teachers/lab-detail-ctrl.js',
            'js/controllers/teachers/student-info-ctrl.js', 'bower_components/js-xlsx/dist/xlsx.core.min.js',
            'bower_components/js-xlsx/dist/cpexcel.js', 'bower_components/js-xlsx/dist/ods.js',
            'bower_components/textAngular/dist/textAngular-rangy.min.js', 'bower_components/spectrum/spectrum.js',
            'bower_components/textAngular/dist/textAngular-sanitize.min.js', 'bower_components/textAngular/dist/textAngular.min.js',
            'bower_components/textAngular/dist/textAngular.min.js', 'js/filters/teachers/student-select.js',
            'js/directives/teachers/textAngular-dropdownToggle.js',
            'bower_components/angular-spectrum-colorpicker/dist/angular-spectrum-colorpicker.min.js'
        ]
    };

    // 定义href对象, 包含相应身份的 css path
    var href = {
        student: ['css/students.css'],
        teacher: ['bower_components/textAngular/dist/textAngular.css', 'bower_components/spectrum/spectrum.css', 'css/teachers.css']
    };

    // 添加js文件
    for (var i = 0, len = src[identity].length; i < len; i++) {
        var body = document.getElementsByTagName('body');
        script = document.createElement('script');
        script.setAttribute('src', src[identity][i]);
        $(body).append(script);
    }

    // 添加css文件
    for (var j = 0, len = href[identity].length; j < len; j++) {
        var head = document.getElementsByTagName('head');
        link = document.createElement('link');
        link.setAttribute('href', href[identity][j]);
        link.setAttribute('rel', 'stylesheet');
        $(head).append(link);
    }

})();
