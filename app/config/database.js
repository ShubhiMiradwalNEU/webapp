const { Sequelize } = require('sequelize');
const fs = require('fs');
require('dotenv').config();


const username = process.env.DB_USER || 'postgres';
const password = process.env.DB_PASSWORD || 'shubhi2304';
const database = process.env.DB_NAME || 'postgres';
const host = process.env.DB_HOSTNAME || 'localhost';

const port = process.env.DB_PORT || 5432;
const dialect = process.env.DB_DIALECT || 'postgres';


console.log({username,password,database,host, port, dialect})
let sequelize = null;
var isSSL = process.env.IS_SSL || false;
if (isSSL){
    sequelize = new Sequelize(database, username, password, {
      host: host,
      port: port,
      dialect: dialect,
      dialectOptions: {
      ssl: {
          require: true, 
          rejectUnauthorized: false 
        }
      }
    });
}
else{
  sequelize = new Sequelize(database, username, password, {
    host: host,
    port: port,
    dialect: dialect, 
  });
}


module.exports = sequelize;