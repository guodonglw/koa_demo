var log4js = require('log4js');
var logger = log4js.getLogger('controllers/mongoTest');
var mongo = require('../libs/mongo');

exports.find = async ctx => {
  logger.info('查询mongo中数据：', JSON.stringify(ctx.request.body));
  let req = ctx.request.body;
  await mongo('find', 'test')
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