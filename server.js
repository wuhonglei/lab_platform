// set up ======================================================================
var express = require('express');
var app = express(); // create our app w/ express
var mongoose = require('mongoose'); // mongoose for mongodb
var port = process.env.PORT || 4040; // set the port 
var config = require('./app/config/config.js'); // load the database config
var morgan = require('morgan'); // log request to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration ===============================================================
mongoose.connect(config.url); // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(express.static(__dirname + config.imgItemPath)); // set the lab item thumbnail image path
app.use(express.static(__dirname + config.imgDetailPath)); // set the lab detail image path
app.use(express.static(__dirname + config.filePath)); // set the lab detail image path
app.use(express.static(__dirname + config.pdfPath)); // set the lab pdf path
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride()); // simulate DELETE and PUT
// routes ======================================================================

// 用户注册登陆
app.use('/user', require('./app/routes/public/login'));
// 验证用户token有效性
app.use(require('./app/routes/public/token-valid'));
// 修改用户密码
app.use('/user', require('./app/routes/public/modify-password'));

// 老师上传学生信息表格, 修改学生信息, 删除学生信息
app.use('/teacher', require('./app/routes/teacher/student-info'));

// 老师 创建, 更新, 删除实验列表
app.use('/teacher', require('./app/routes/teacher/lab'));
app.use('/student', require('./app/routes/student/lab'));


// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
