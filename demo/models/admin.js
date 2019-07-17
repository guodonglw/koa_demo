const dbquery = require('../libs/mysql').query;

// 查询登录账号信息
exports.findAdmin = (name) => {
  let _sql = "SELECT * FROM sa_user WHERE LoginName = ?";
  return dbquery(_sql, name)
};
