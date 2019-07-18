/**
 * 该部分为mongo数据库相关的封装，如果使用的是mongo数据库，请使用该部分连接
 */
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const mongoConfig = require('../config/default').mongoConfig;
const log4js = require('log4js');
const logger = log4js.getLogger('/libs/mongo');

var url = mongoConfig.url;  // 连接mongo的url
var dbname = mongoConfig.dbname;  // 要操作的数据库

var insert = function (collection, data, client, callback) {
  collection.insert(data, function (err, result) {
    if (err) {
      logger.error(err)
    } else {
      logger.info('插入成功');
      callback(result.result)
    }
    client.close()
  })
};

var updateOne = function (collection, data, client, callback) {
  collection.updateOne(data[0], data[1], function (err, result) {
    if (err) {
      logger.error(err)
    } else {
      logger.info('更新成功');
      callback(result.result)
    }
    client.close()
  })
};

var deleteOne = function (collection, data, client, callback) {
  collection.deleteOne(data, function (err, result) {
    if (err) {
      logger.error(err)
    } else {
      logger.info('删除成功');
      callback(result.result)
    }
    client.close()
  })
};

var find = function (collection, data, client, callback) {
  collection.find(data).toArray(function (err, result) {
    if (err) {
      logger.error(err)
    } else {
      logger.info('查询成功');
      callback(result)
    }
    client.close()
  })
};

var method = {
  insert: insert,
  updateOne: updateOne,
  deleteOne: deleteOne,
  find: find
};

var operateData = function (type, collectionname, data, callback) {
  MongoClient.connect(url, function (err, client) {
    if (err) {
      logger.error('连接mongo失败：' + err)
    } else {
      logger.info('连接mongo成功');
      var db = client.db(dbname);
      var collection = db.collection(collectionname);
      // 增删改查
      method[type](collection, data, client, callback)
    }
  })
};

module.exports = operateData;

/**
 * 实际调用时
 * var operateData = require('./libs/mongo.js');
 * operateData('insert', 'testCollection', [{'name': 'test'}]).then(result => {console.log(result)})
 */
