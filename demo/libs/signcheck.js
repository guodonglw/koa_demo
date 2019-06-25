const log4js = require('log4js');
const logger = log4js.getLogger('signcheck');

// 该处可添加对前端发送来的请求内容做一个简单的验证，如token验证
exports.signCheck = async (ctx, next) => {
  logger.info('路由前验证');
  await next()
};
