const log4js = require('log4js');
const logger = log4js.getLogger('controller/admin');
const models = require('../models/admin');
const authutil = require('../libs/authutil');

/**
 * @function 登录接口函数
 * @param ctx
 * @returns {Promise<void>}
 */
exports.loginSystem = async ctx => {
  logger.info("用户登录：" + JSON.stringify(ctx.request.body));
  let { name, password } = ctx.request.body;
  // 查询该管理员信息
  await models.findAdmin(name)
    .then(result => {
      lengthAdmin = result.length;
      checkPassword = (authutil.MD5(password) === result[0].Password)
    }).catch(err => {
      logger.info(err);
      ctx.body = {
        code: 500,
        message: err
      }
    });
  // 如果管理员存在且为1，则继续核实密码
  if (lengthAdmin === 1 && checkPassword) {
    logger.info('登录成功');
    // 设置服务器端session内容，用于路由中间验证
    ctx.session = {
      test: 'test'
    };
    ctx.body = {
      code: 200,
      message: '登录成功'
    }
  } else {
    logger.info('登录失败');
    ctx.body = {
      code: 500,
      message: '该用户不存在'
    }
  }
};
