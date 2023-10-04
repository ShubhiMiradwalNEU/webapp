const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../config/database");

const User=sequelize.define('user',{
    first_name: {
        type:DataTypes.STRING,
        allowNull:false,
    },
    last_name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
    }
});

const user=sequelize.model('user',User);
module.exports=user;