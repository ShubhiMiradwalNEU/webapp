const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require( "../config/database");
const User = require('./user-model');
const createassignment = sequelize.define('assignment',{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      num_of_attempts: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User,
          key: 'id',
        },
      },
});

const assignment = sequelize.model('assignment', createassignment);
module.exports = assignment;