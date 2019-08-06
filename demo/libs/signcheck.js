/**
 * 该部分为路由验证中间件，可根据自己的需求添加验证规则（如验证token）
 */
const log4js = require('log4js');
const logger = log4js.getLogger('signcheck');

// 该处可添加对前端发送来的请求内容做一个简单的验证，如token验证
exports.signCheck = async (ctx, next) => {
  logger.info('路由前验证');
  // logger.info(ctx);
  await next()
};
