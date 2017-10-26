const express = require('express');
const jwt = require('../utils/jwt-middleware');
const wrap = require('../utils/wrap-promise');
const resourceManager = require('../services/resource-manager').get();

const router = new express.Router();
router.get('/', wrap(req => resourceManager.getList(req.query)));
router.get('/:id/status', wrap(req => resourceManager.getStatus(req.params.id)));

module.exports = (app) => {
  router.use(jwt);
  app.use('/resource', router);
};
