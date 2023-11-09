const express = require('express');
const router = express.Router();
const assignmentController = require('../controller/assignment-controller');
const user = require('../model/user-model');
const {findByEmail} = require('../services/user-service');
const sequelize = require('../config/database');
const StatsD = require('node-statsd');
const logger = require('../../logger');
const client = new StatsD({
    host: 'localhost',
    port: 8125
});

router.get('/assignment', (req, res) => {
    assignmentController.getAssignment(req,res);
});

router.get('/assignment/:id', (req, res) => {
    assignmentController.getAssignmentById(req, res);
});

router.post('/assignment', (req, res) => {
     assignmentController.postAssignment(req, res);
});

router.put('/assignment/:id', (req, res) => {
    assignmentController.updateAssignment(req, res);
});

router.delete('/assignment/:id', (req,res)=>
{
    assignmentController.deleteAssignment(req, res);
});

router.patch('/assignment/:id', (req, res) => {
    logger.info("patch Request for assignement is called");
    client.increment("patch-Request-assignemnt")
    res.status(405).end();
});

module.exports = router;