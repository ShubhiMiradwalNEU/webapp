const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres', 'shubhi2304', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
});

module.exports = sequelize;