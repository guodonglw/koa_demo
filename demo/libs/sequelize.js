/**
 *该部分为通过sequelize进行orm映射mysql数据库的代码，对应user的相关操作
 */
const Sequelize = require('sequelize');
const config = require('../config/default').sequelizeConfig;

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  }
);

module.exports = sequelize;
