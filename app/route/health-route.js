const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

router.get('/healthz', async (req, res) => {
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
    }
  }
});

router.get('*', (req, res) => {
  res.status(404).end();
});

router.post('/healthz', async (req, res) => {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
  res.status(405).json({ message: 'Method not allowed' });
});

router.delete('/healthz', async (req, res) => {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
  res.status(405).json({ message: 'Method not allowed' });
});

router.put('/healthz', async(req, res) => {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
  res.status(405).json({ message: 'Method not allowed' });
});

module.exports = router;
