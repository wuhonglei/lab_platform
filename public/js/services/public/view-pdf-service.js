// 预览PDF文件
// 通过改变filename的值, 就可以预览不同的PDF文件
angular.module('myApp')
    .factory('PDF', function() {
        var viewPdf = function(filename) {
            var element = document.createElement('a');
            element.setAttribute('href', 'js/pdf/web/viewer.html?file=%2F' + filename);
            element.setAttribute('target', 'blank');

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();
            document.body.removeChild(element);
        };

        return {
            view: viewPdf
        };
    });
