var log4js = require('log4js');
var logger = log4js.getLogger('/controller/redisTest/');
var redisSet = require('../libs/redis').setData;
var redisGet = require('../libs/redis').getData;

/**
 * 测试redis写入数据接口
 */
exports.setData = async ctx => {
  logger.info('向redis插入内容: ' + JSON.stringify(ctx.request.body));
  let req = ctx.request.body;
  await redisSet(0, 'test', 'test', 10000)
  .then((result) => {
    logger.info("result: " + result);
    ctx.body = {
      code: 200,
      msg: result
    }
  }).catch((err) => {
    logger.error("err: " + JSON.stringify(err));
    ctx.body = {
      code: 500,
      msg: err
    }
  })
}

/**
 * 测试redis获取数据接口
 */
exports.getData = async ctx => {
  logger.info('从redis读取数据: ' + JSON.stringify(ctx.request.body));
  logger.info('pid is: ', process.pid)
  let req = ctx.request.body;
  await redisGet(0, 'test')
  .then((result) => {
    logger.info("result: " + result);
    ctx.body = {
      code: 200,
      msg: result
    }
  }).catch((err) => {
    logger.error("err: " + JSON.stringify(err));
    ctx.body = {
      code: 500,
      msg: err
    }
  })
}