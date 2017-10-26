const uuid = require('../utils/uuid');

class PaymentManager {
  constructor() {
    this.payments = {};
  }

  getList() {
    return Object.keys(this.payments).map(k => ({
      id: this.payments[k].id,
    }));
  }

  startPayment(resource, paymentData) {
    const id = uuid();
    this.payments[id] = resource.startPayment({ id, ...paymentData });
    return id;
  }
}

let instance = null;
function get() {
  if (instance === null) {
    instance = new PaymentManager();
  }
  return instance;
}
module.exports = { get, PaymentManager };
