const { Sequelize } = require('sequelize');
const fs = require('fs');
require('dotenv').config();


const username = process.env.DB_USER || 'postgres';
const password = process.env.DB_PASSWORD || 'shubhi2304';
const database = process.env.DB_NAME || 'postgres';
const host = process.env.DB_HOSTNAME || 'localhost';

const port = process.env.DB_PORT || 5432;
const dialect = process.env.DB_DIALECT || 'postgres';

const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: dialect,
  dialectOptions: {
    ssl: {
      require: true, // This will help you. But you will see nwe error
      rejectUnauthorized: false // This line will fix new error
    }
  }
});

module.exports = sequelize;