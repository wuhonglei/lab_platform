// 参考网址: http://mongoosejs.com/docs/2.7.x/

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
});
// 查询链接: https://docs.mongodb.com/manual/tutorial/query-documents/
// 查询数组中的某一个元素: queray = {arrayName: elementValue}

SCheme.findOne(query, projection, function(err, doc) {
    // doc 是一个对象
});

// 找到一个并删除
SCheme.findOneAndRemove(query, options, function(err, updateState) {
    // error: errors that occurred 
    // updateState: { ok: 1, nModified: 37, n: 37 }
});

// 找到一个并更新
var doc = {
    $set: {
        key1: value1
    }
}
SCheme.findOneAndUpdate(query, doc, options, function(err, updateState) {
    // error: errors that occurred 
    // updateState: { ok: 1, nModified: 37, n: 37 }
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
SCheme.update(query, doc, options, function(err, updateState) {
    // updateState: { ok: 1, nModified: 37, n: 37 }
    // ok: 操作是否被正常执行   nModified: 修改的document数目, n: 符合更新条件的数目
});

document.update(doc, options, function(err) {});
/* ---------options------------
upsert: true 如果更新不存在则, 创建一个documents插入
multi: true  如果满足条件的docs存在, 则可以更新多条docs
writeConcern
 --------options------------*/

/*
    更新例子:
//给定的数据如下: 
{
  _id: 1,
  item: "TBD",
  stock: 0,
  info: { publisher: "1111", pages: 430 },
  tags: [ "technology", "computer" ],
  ratings: [ { by: "ijk", rating: 4 }, { by: "lmn", rating: 5 } ],
  reorder: false
}

//更新操作
db.books.update(
   { _id: 1 },
   {
     $inc: { stock: 5 },
     $set: {
       item: "ABC123",
       "info.publisher": "2222",
       tags: [ "software" ],
       "ratings.1": { by: "xyz", rating: 3 }
     }
   }
)

//更新结果是: 
{
  "_id" : 1,
  "item" : "ABC123",
  "stock" : 5,
  "info" : { "publisher" : "2222", "pages" : 430 },
  "tags" : [ "software" ],
  "ratings" : [ { "by" : "ijk", "rating" : 4 }, { "by" : "xyz", "rating" : 3 } ],
  "reorder" : false
}
*/
