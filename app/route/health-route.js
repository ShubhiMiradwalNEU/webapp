const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const logger = require('../../logger');
const StatsD = require('node-statsd');


const client = new StatsD({
  host: 'localhost',
  port: 8125
});


router.get('/healthz', async (req, res) => {

  if (Object.keys(req.body).length > 0 || Object.keys(req.query).length > 0) {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Length', '0');
    res.status(400).end();
  } else {
    try {
      await sequelize.authenticate();
      // logger.info("Get Request for healthz is called");
      // client.increment("Get-Request-healthz")
      console.log('Connection has been established successfully.');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Length', '0');
      res.status(200).end();
      logger.info("Get Request for healthz is called");
      client.increment("Get-Request-healthz")
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Length', '0');
      res.status(503).end();
      logger.info("Get Request for healthz and it failed");
    }
  }
});

router.get('/healthzz', async (req, res) => {
  if (Object.keys(req.body).length > 0 || Object.keys(req.query).length > 0) {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Length', '0');
    res.status(400).end();
  } else {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Length', '0');
      res.status(200).end();
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Length', '0');
      res.status(503).end();
      logger.info("Get Request for healthz and it failed");

    }
  }
});


router.get('*', (req, res) => {

  res.status(404).end();
});

router.post('/healthz', async (req, res) => {

  await sequelize.authenticate();
  logger.info("post Request for healthz is called");
  client.increment("post-Request-healthz")
  console.log('Connection has been established successfully.');
  res.status(405).json({ message: 'Method not allowed' });
});

router.delete('/healthz', async (req, res) => {

  await sequelize.authenticate();
  logger.info("delete Request for healthz is called");
  client.increment("delete-Request-healthz")
  console.log('Connection has been established successfully.');
  res.status(405).json({ message: 'Method not allowed' });
});

router.put('/healthz', async(req, res) => {
  await sequelize.authenticate();
  logger.info("put Request for healthz is called");
  client.increment("put-Request-healthz")
  console.log('Connection has been established successfully.');
  res.status(405).json({ message: 'Method not allowed' });
});

module.exports = router;
