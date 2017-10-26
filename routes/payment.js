const express = require('express');
const jwt = require('../utils/jwt-middleware');
const wrap = require('../utils/wrap-promise');
const resourceManager = require('../services/resource-manager').get();
const paymentManager = require('../services/payment-manager').get();

const router = new express.Router();
router.get('/', wrap(req => paymentManager.getList(req.query)));
router.post('/:type', wrap((req) => {
  const res = resourceManager.getByType(req.params.type);
  return paymentManager.startPayment(res, req.body);
}));
router.get('/:id/status', wrap(req => paymentManager.getById(req.params.id)));

module.exports = (app) => {
  router.use(jwt);
  app.use('/payment', router);
};
