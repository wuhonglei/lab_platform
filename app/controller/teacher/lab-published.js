// 已布置的 '实验-班级' 列表
var LabPublishedList = require('../../models/lab-post').LabPublishedList;

module.exports.getPublishedList = function(req, res) {
    var query = {
        number: req.decoded.number
    };
    LabPublishedList.find(query, function(err, docs) {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
        return res.status(200).json({
            success: true,
            labPublishedList: docs
        });
    });
};
