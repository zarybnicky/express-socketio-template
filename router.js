const express = require('express');

const router = express.Router();

router.get('/error', (req, res, next) =>
  next(new Error('This is an error and it should be logged to the console')));

router.get('/', (req, res) => {
  res.write('This is a normal request, it should be logged to the console too');
  res.end();
});

module.exports = router;
