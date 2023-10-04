const express = require('express');
const router = express.Router();

router.get('/healthz', (req, res) => {
  if (Object.keys(req.body).length > 0) {
    res.status(400).json({ message: 'Bad Request' });
  } else {
    res.setHeader('Content-Length', '0');
    res.status(200).json({ message: 'OK' });
  }
});

router.post('/healthz', (req, res) => {
  res.status(405).json({ message: 'Method not allowed' });
});

router.delete('/healthz', (req, res) => {
  res.status(405).json({ message: 'Method not allowed' });
});

router.put('/healthz', (req, res) => {
  res.status(405).json({ message: 'Method not allowed' });
});

module.exports = router;
