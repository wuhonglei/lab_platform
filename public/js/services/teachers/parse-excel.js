// 老师界面 -- 解析上传的excel, 将学生的信息转换为json格式数组
angular.module('myApp')
    .factory('Excel', ['$http', '$q', function($http, $q) {
        // HTML5 input file element using readAsBinaryString:
        // 只读取excel表格中sheet1
        var readExcel = function(file) {
            const PARSELABLE = "------------------解析表格----------------------";
            console.time(PARSELABLE);
            var reader = new FileReader();
            var deferred = $q.defer();
            reader.onload = function(e) {
                var data = e.target.result;
                var workbook = XLSX.read(data, { type: 'binary' });
                /* DO SOMETHING WITH workbook HERE */
                var result = toJson(workbook);
                if (result.isFormatRight) {
                    const TIMELABLE = '------------------合并开始-----------------------';
                    console.time(TIMELABLE);
                    // 合并同名的班级
                    var length = result.data.length;
                    console.log('解析数据前: ', result.data);
                    // 存放所有班级的描述
                    var descriptions = [];
                    var newData = [];
                    // 存放班级对应的数组下标
                    var flag = [];
                    var isSame = false;
                    for (var i = 0; i < length; i++) {
                        var desc = result.data[i].description;
                        if (descriptions.length) {
                            var index = descriptions.indexOf(desc);
                            isSame = false;
                            if (index != -1) {
                                console.log('desc = ', desc);
                                var tmpInfo = result.data[i].info;
                                newData[flag[index]].info = newData[flag[index]].info.concat(tmpInfo);
                                isSame = true;
                            }
                        }
                        if (!isSame) {
                            console.log('push');
                            descriptions.push(result.data[i].description);
                            newData.push(result.data[i]);
                            flag.push(i);
                        }
                    }
                    result.data = (newData.length) ? newData : result.data;
                    console.timeEnd(TIMELABLE);
                    console.log('解析数据后: ', result.data);
                    deferred.resolve(result.data);
                } else {
                    deferred.reject(result);
                }
            };
            reader.readAsBinaryString(file);
            console.timeEnd(PARSELABLE);
            return deferred.promise;
        };

        // Working with the Workbook
        function toJson(workbook) {
            var length = workbook.SheetNames.length;

            // 遍历的列号是, A, B, C
            var columnArray = ['A', 'B', 'C'];
            var classLists = [];
            // student对象的属性值
            var studentPro = ['index', 'number', 'name'];
            // 遍历sheets表单
            for (var j = 0; j < length; j++) {
                // 分别定义表格中连续出现空白行数量
                var spaceRow = 0;
                // 从第二行开始遍历表格
                var rowNum = 2;
                // excel中开课学期单元格中, B, C 列所在的单元格是空单元格, 需要剔除
                var contSpace = 0;
                // 存放某个学生的序号, 学号, 姓名
                var student = {};
                // 存放一个班级里面所有学生的序号, 学号, 姓名
                var info = [];
                // 存储一个班级的学生信息
                var classOne = {};
                // 存储所有班级的学生信息
                var sheet_name = workbook.SheetNames[j];
                /* Get worksheet */
                var worksheet = workbook.Sheets[sheet_name];
                var address_of_cell;
                /* Find desired cell */
                var desired_cell;
                /* Get the value */
                var desired_value;
                // 遍历某一sheet表单, 如果出现连续10行空单元格,  中止执行
                while (spaceRow < 10) {
                    // 如果当前遍历单元格是学号(或姓名), 则起始遍历列号是'B'
                    for (var i = 0; i <= 2; i++) {
                        address_of_cell = columnArray[i].concat(rowNum);
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
                                break;
                            } else if (/开课学期/.test(desired_value)) {
                                // 当前单元格是一个新班级的开始
                                // 开课学期：2016-2017-1 课程：网络安全 教师：王伟平 班级：信安1401-2
                                classOne.description = desired_value;
                                // 开课学期
                                classOne.year = desired_value.split("课程：")[0].split("开课学期：").pop().trim();
                                // 课程名称
                                classOne.course = desired_value.split("课程：")[1].split("教师：").shift().trim();
                                // 班级名称
                                classOne.class = desired_value.split("班级：").pop().trim();
                                // 空行数量为0
                                spaceRow = 0;
                                break;
                            } else if (/序号|学号|姓名/.test(desired_value)) {
                                var value1 = worksheet[columnArray[0].concat(rowNum)];
                                var value2 = worksheet[columnArray[1].concat(rowNum)];
                                var value3 = worksheet[columnArray[2].concat(rowNum)];
                                if (!(value1 && value2 && value3) || value1.v.concat(value2.v, value3.v) !== "序号学号姓名") {
                                    return {
                                        isFormatRight: false,
                                        sheetName: sheet_name,
                                        rowNum: rowNum
                                    };
                                }
                                // 序号, 学号, 姓名是合并单元格, 需要跳过下一行
                                rowNum = rowNum + 1;
                                break;
                            } else if (/[\d\u4e00-\u9fa5]+/.test(desired_value)) {
                                // 单元格值是序号, 学号, 姓名
                                var property = studentPro[i];
                                student[property] = desired_value;
                            }
                        } else if (desired_cell === undefined) {
                            contSpace++;
                        }
                    } // for结束
                    if (contSpace === 3) {
                        spaceRow++;
                    }
                    if (student.number && student.name) {
                        info.push(student);
                        student = {};
                    }
                    contSpace = 0;
                    // 某一列遍历完, 行号加1
                    rowNum++;
                } //while结束
                if (info.length > 0) {
                    classOne.info = info;
                    classLists.push(classOne);
                    classOne = {};
                }
            } //outer loop for
            return {
                isFormatRight: true,
                data: classLists
            };

        }
        return {
            excel2json: readExcel
        };
    }]);
