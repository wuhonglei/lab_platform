// 声明一个模式
var SCheme = require('/path/to/scheme');

// 声明一个document
// var doc = new SCheme(object);
var doc = new SCheme();
// assigment to doc

/*
	================================保存到数据库====================================
*/
// 或者直接写 doc.save();
// doc.save().exec()
doc.save(function(err) {
    if (err) {
        // 保存失败
    } else {
        // 保存成功
    }
});

/*
	================================查询===========================================
*/
// 查询条件
var query = {
    key1: value1,
    key2: value2
};

// 返回数据, 1 表示返回, 0表示不返回
var projection = {
    key1: 1,
    key2: 1
};

// 返回数据的排序方式
var options = {
    limit: number,
    skip: offsetInt,
    // 1 是升序, -1 是降序
    sort: {
        key1: 1
    }
};

SCheme.find(query, projection, options, function(err, docs) {
    /* body... */
    // docs 是一个数组
})

SCheme.findOne(query, projection, function(err, doc) {
    // doc 是一个对象
});

// 找到一个并删除
SCheme.findOneAndRemove(query, options, function(err, doc) {
    // error: errors that occurred 
    // doc: the document before updates are applied if `new: false`, or after updates if `new = true`(default is false)
});

// 找到一个并更新
var doc = {
    $set: {
        key1: value1
    }
}
SCheme.findOneAndUpdate(query, doc, options, function(err, doc) {
    // error: errors that occurred 
    // doc: the document before updates are applied if `new: false`, or after updates if `new = true`(default is false)
});

/*
	================================删除===========================================
*/
SCheme.remove(query, function(err, removed) {
    // removed 表示删除的documents数量
});
// remove all the documents SChema.remove(callback);
SCheme.remove(query).exec();
// or doc.remove().exec()
// or doc.remove(callback)
doc.remove();

/*
	================================更新===========================================
*/
var doc = {
    $set: {
        key1: value1
    }
}
// or SChema.update(query, doc, options).exec();
SCheme.update(query, doc, options, function(err, doc) {
    // doc: the document before updates are applied if `new: false`, or after updates if `new = true`(default is false)
});

// or document.update(query, doc, options).exec();
document.update(doc, options, function(err) {
});
