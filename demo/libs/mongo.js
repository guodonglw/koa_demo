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

// 初始化连接数据库
var init = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, {useNewUrlParser:true}, (err, client) => {
      if (err) {
        logger.error('mongo连接失败');
        reject(err)
      } else {
        logger.info('mongo连接成功');
        resolve(client)
      }
    }); 
  }) 
}

// 该处为对数据库操作时间过长时则终止操作并放回提示
var timeout = function(ms) {
  let delayInfo = {
    timeoutMsg: '数据库操作超时'
  };
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      reject(delayInfo)
    }, ms)
  })
}

var insert = (collection, data, client) => {
  return new Promise((resolve, reject) => {
    collection.insert(data, (err, result) => {
      if (err) {
        logger.error(err);
        reject(err)
      } else {
        logger.info('插入成功');
        resolve(result.result)
      }
      client.close()
    })
  }) 
};

var updateOne = (collection, data, client) => {
  return new Promise((resolve, reject) => {
    collection.updateOne(data[0], data[1],(err, result) => {
      if (err) {
        logger.error(err);
        reject(err)
      } else {
        logger.info('更新成功');
        resolve(result.result)
      }
      client.close()
    })
  })  
};

var deleteOne = (collection, data, client) => {
  return new Promise((resolve, reject) => {
    collection.deleteOne(data, (err, result) => {
      if (err) {
        logger.error(err);
        reject(err)
      } else {
        logger.info('删除成功');
        resolve(result.result)
      }
      client.close()
    })
  })
};

var find = (collection, data, client) => {
  return new Promise((resolve, reject) => {
    collection.find(data).toArray(function (err, result) {
      if (err) {
        logger.error(err);
        reject(err)
      } else {
        logger.info('查询成功');
        resolve(result)
      }
      client.close()
    })
  })
};

var method = {
  insert: insert,
  updateOne: updateOne,
  deleteOne: deleteOne,
  find: find
};

/**
 * @function 外部接口调用mongo方法
 * @param {*} type 
 * @param {*} collectionname 
 * @param {*} data 
 */
var operateData = function (type, collectionname, data) {
  return new Promise((resolve, reject) => {
    init()
    .then((client) => {
      var db = client.db(dbname);  // 查询数据库名
      var collection = db.collection(collectionname);  // 查询集合名
      resolve(method[type](collection, data, client));
    }).catch((err) => {
      console.log('err:',err)
      reject(err)
    })
  })
};

module.exports = operateData;

/**
 * 实际调用时
 * var operateData = require('./libs/mongo.js');
 * operateData('insert', 'testCollection', [{'name': 'test'}]).then(result => {console.log(result)})
 */
