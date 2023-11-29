const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../config/database");

const createSubmission=sequelize.define('submission',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    assignment_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    submission_url: {
        type:DataTypes.STRING,
        allowNull:false,
    },
    submission_date:{
        type:DataTypes.DATE,
        allowNull:true,
    },
    submission_updated:{
        type:DataTypes.DATE,
        allowNull:true,
    },
});

const submission=sequelize.model('submission',createSubmission);
module.exports=submission;