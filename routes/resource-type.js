const express = require('express');
const jwt = require('../utils/jwt-middleware');

const router = new express.Router();
router.get('/', (req, res) => {
  res.json([
    'hwproxy',
  ]);
});

module.exports = (app) => {
  router.use(jwt);
  app.use('/resource-types', router);
};
