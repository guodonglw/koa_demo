const config = {
  port: 4001,
  // 该处为mysql数据库配置
  database: {
    HOST: '',
    USERNAME: '',
    PASSWORD: '',
    DATABASE: '',
    PORT: 3306
  },

  // 该处为进行sequelize连接进行数据库配置项（实际也为mysql数据库配置，实际使用根据自己的选择，和上面database的配置二选一）
  sequelizeConfig: {
    database: '',
    username: '',
    password: '',
    host: '',
    port: 3306,
    dialect: 'mysql'
  },

  // 如果用的是mongo数据库，对应的mongo配置
  mongoConfig: {
    url: '',
    dbname: ''
  }
};

module.exports = config;
