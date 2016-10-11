// 老师界面 -- 解析上传的excel, 将学生的信息转换为json格式数组
angular.module('myApp')
    .factory('Excel', ['$http', '$q', function($http, $q) {
        // HTML5 input file element using readAsBinaryString:
        // 只读取excel表格中sheet1
        var readExcel = function(file) {
            var reader = new FileReader();
            var name = file.name;
            var deferred = $q.defer();
            reader.onload = function(e) {
                console.log(e);
                var data = e.target.result;
                var workbook = XLSX.read(data, { type: 'binary' });
                /* DO SOMETHING WITH workbook HERE */
                var result = toJson(workbook);
                deferred.resolve(result);
            };
            reader.readAsBinaryString(file);
            return deferred.promise;
        };

        // Working with the Workbook
        function toJson(workbook) {
            var first_sheet_name = workbook.SheetNames[0];
            /* Get worksheet */
            var worksheet = workbook.Sheets[first_sheet_name];
            /* Find desired cell */
            var address_of_cell;
            var desired_cell;
            /* Get the value */
            var desired_value;

            // 分别定义表格中连续出现空白行数量, 是否开始阅读学号, 起始列标号, 起始行标号
            var spaceRow = 0;
            var readStuNum = false;
            var startColumn;
            var startRow = 2;
            var columnArray = ['A', 'B', 'C'];
            // 存储一个班级的学生信息
            var classOne = {};
            // 存储所有班级的学生信息
            var classLists = [];
            // 存放某个学生的学号, 姓名
            var student = {};
            // 存放一个班级所有学生的学号, 姓名
            var info = [];
            var i;
            // 便利excel单元格
            while (spaceRow < 10) {
                // 如果当前遍历单元格是学号(或姓名), 则起始遍历列号是'B'
                startColumn = (readStuNum) ? '1' : '0';
                for (i = startColumn; i <= 2; i++) {
                    address_of_cell = columnArray[i].concat(startRow);
                    desired_cell = worksheet[address_of_cell];
                    // 单元格
                    if (desired_cell != undefined) {
                        desired_value = desired_cell.v;
                        if (/学生课堂考勤表/.test(desired_value)) {
                            // 一个新班级信息表
                            classOne.info = info;
                            classLists.push(classOne);
                            classOne = {};
                            student = {};
                            info = [];
                        } else if (/开课学期/.test(desired_value)) {
                            // 当前单元格是一个新班级的开始
                            // 开课学期：2016-2017-1 课程：网络安全 教师：王伟平 班级：信安1401-2
                            classOne.description = desired_value;
                            classOne.className = desired_value.split("班级：").pop();
                            classOne.year = desired_value.split("课程：")[0].split("开课学期：").pop();
                            // 空行数量为0
                            spaceRow = 0;
                            break;
                        } else if (/序号|姓名|学号/.test(desired_value)) {
                            // 接下来会是学号, 姓名
                            readStuNum = true;
                            break;
                        } else if (/[\d\u4e00-\u9fa5a-zA-Z]+/.test(desired_value)) {
                            // 单元格值是学号或姓名
                            if (i == 1) {
                                student.number = desired_value;
                            } else if (i == 2) {
                                student.name = desired_value;
                            }
                        }
                    } else {
                        readStuNum = false;
                        spaceRow++;
                    }
                } // for结束
                if (student.number != undefined) {
                    info.push(student);
                    student = {};
                }
                // 某一列遍历完, 行号加1
                startRow++;
            } //while结束
            if (info.length > 0) {
                classOne.info = info;
                classLists.push(classOne);
            }
            return classLists;
        }

        return {
            excel2json: readExcel
        };
    }]);
