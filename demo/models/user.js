const Sequelize = require('sequelize');
const instance = require('../libs/sequelize');

var user = instance.define(
  'user',
  {
    'userId': {
      field: 'user_id',
      primaryKey: true,
      type: Sequelize.BIGINT,
      allowNull: false
    },
    'userName': {
      field: 'user_name',
      type: Sequelize.STRING,
      allowNull: false
    },
    'mail': {
      field: 'mail',
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'user',
    timestamps: false,
    freezeTableName: true
  }
);

module.exports = user;
