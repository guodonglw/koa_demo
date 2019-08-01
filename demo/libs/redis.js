/**
 * 进行关于redis部分的封装
 */
var redis = require('redis');
var log4js = require('log4js');
var logger = log4js.getLogger('/libs/redis')
var redisConfig = require('../config/default').redisConfig;
var client = redis.createClient(redisConfig.port, redisConfig.host);

client.on('error', function(err) {
  logger.error('redis error: ' + err)
})

client.on('connect', function(err) {
  logger.info('redis连接成功...')
})

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

/**
 * @function 向redis插入数据方法
 * @param {*} dbNum 库号
 * @param {*} key 键
 * @param {*} value 值
 * @param {*} expire 过期时间
 */
var set = function(dbNum, key, value, expire) {
  return new Promise((resolve, reject) => {
    client.select(dbNum, (err) => {
      if(err) {
        logger.error('redis set 选择数据库失败: ' + err);
        reject(err)
      } else {
        client.set(key, value, (err, result) => {
          if (err) {
            logger.error('redis插入失败: ' + err);
            reject(err)     
          } else {
            if (!isNaN(expire) && expire > 0) {
              client.expire(key, parseInt(expire))
            }
            resolve(result)
          } 
        })
      }
    })
  })  
}

/**
 * @function 从redis获取数据方法
 * @param {*} dbNum 
 * @param {*} key 
 */
var get = function(dbNum, key) {
  return new Promise((resolve, reject) => {
    client.select(dbNum, (err) => {
      if (err) {
        logger.error('redis get 选库失败: ' + err);
        reject(err)
      } else {
        client.get(key, (err, result) => {
          if (err) {
            logger.error('redis获取数据失败: ' + err);
            reject(err)
          } else {
            resolve(result)
          }
        })
      }
    })
  })
}

// 写入数据接口
exports.setData = function(dbNum, key, value, expire) {
  return Promise.race([
    set(dbNum, key, value, expire),
    timeout(2000)
  ])
}

// 获取数据接口
exports.getData = function(dbNum, key) {
  return Promise.race([
    get(dbNum, key),
    timeout(2000)
  ])
}
