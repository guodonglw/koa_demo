const log4js = require('log4js');
const logger = log4js.getLogger('controller/user');
const user = require('../models/user');

/**
 * @function 增加数据接口
 * @param ctx
 * @returns {Promise<void>}
 */
exports.insertUser = async ctx => {
  logger.info("插入请求内容：" + JSON.stringify(ctx.request.body));
  let req = ctx.request.body;
  await user.create({
    userId: parseInt(req.userId),
    userName: req.userName,
    mail: req.mail
  }).then(result => {
    logger.info("insert value:" + JSON.stringify(result.dataValues));
    ctx.body = {
      code: 200,
      message: '添加成功'
    }
  }).catch(err => {
    logger.error(err);
    ctx.body = {
      code: 400,
      message: '添加出错',
      err: err
    }
  })
};

/**
 * @function 删除数据接口
 * @param ctx
 * @returns {Promise<void>}
 */
exports.delUser = async ctx => {
  logger.info("删除请求内容：" + JSON.stringify(ctx.request.body));
  let req = ctx.request.body;
  await user.destroy({
    'where': {
      'userId': req.userId
    }
  }).then(result => {
    logger.info("del value:" + JSON.stringify(result.dataValues));
    ctx.body = {
      code: 200,
      message: '删除成功'
    }
  }).catch(err => {
    ctx.body = {
      code: 400,
      message: '删除出错',
      err: err
    }
  })
};

/**
 * @function 更新数据接口
 * @param ctx
 * @returns {Promise<void>}
 */
exports.updateUser = async ctx => {
  logger.info("更新请求内容：" + JSON.stringify(ctx.request.body));
  let req = ctx.request.body;
  await user.update(req.content,{  // req.content为需要跟新的内容{"userName": "test"}
    'where': {
      'userId': req.userId
    }
  }).then(result => {
    logger.info("update value:" + JSON.stringify(result.dataValues));
    ctx.body = {
      code: 200,
      message: '更新成功'
    }
  }).catch(err => {
    ctx.body = {
      code: 400,
      message: '更新出错',
      err: err
    }
  })
};

/**
 * @function 查询数据接口
 * @param ctx
 * @returns {Promise<void>}
 */
exports.findUser = async ctx => {
  logger.info("查询请求内容：" + JSON.stringify(ctx.request.body));
  let req = ctx.request.body;
  await user.findAll({
    attributes:{ exclude: [] }
    /*
    'where': {
      'userId': req.userId
      'userName': req.userName
    }
    */
  }).then(result => {
    logger.info("find value:" + JSON.stringify(result));
    ctx.body = {
      code: 200,
      message: '查询成功',
      data: result
    }
  }).catch(err => {
    ctx.body = {
      code: 400,
      message: '查询失败',
      err: err
    }
  })
};
