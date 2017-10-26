const {
  Started, Cancelled, RemoteError, Completed,
} = require('../utils/payment-status');

class Payment {
  constructor(data) {
    this.data = data;
    this.status = Started;
  }

  error() {
    this.status = RemoteError;
  }

  cancel() {
    this.status = Cancelled;
  }

  complete() {
    this.status = Completed;
  }
}

module.exports = Payment;
