const wss = require('socket.io-client');
const paymentManager = require('./payment-manager').get();
const {
  Connecting, Connected, ConnectFailed, Reconnecting, Disconnected,
} = require('../utils/connection-status');

class HwProxyClient {
  constructor(id, url, opts) {
    this.type = 'hwproxy';

    this.id = id;
    this.url = url;
    this.opts = opts;
    this.status = Connecting;
    this.socket = this.makeSocket(url, opts);
  }

  makeSocket(url, opts) {
    const socket = wss(url, opts);
    // FIXME: Client socket logging

    socket.on('payment_complete', (id, data) => {
      // FIXME: Correct logging
      if (!(id in paymentManager.payments)) {
        return;
      }
      paymentManager.payments[id].complete(data);
    });
    socket.on('payment_cancel', (id, data) => {
      if (id in paymentManager.payments) {
        paymentManager.payments[id].cancel(data);
      }
    });
    socket.on('payment_error', (id, data) => {
      if (id in paymentManager.payments) {
        paymentManager.payments[id].error(data);
      }
    });

    // On first connection & every subsequent reconnect
    socket.on('connect', () => {
      this.status = Connected;
    });

    // What's the behavior here?
    socket.on('connect_error', () => {
      this.status = ConnectFailed;
    });
    socket.on('connect_timeout', () => {
      this.status = ConnectFailed;
    });
    socket.on('error', () => {
      this.status = ConnectFailed;
    });

    // After a clean disconnect (API initiated)
    socket.on('disconnect', () => {
      this.status = Disconnected;
    });

    // When we start to reconnect
    socket.on('reconnecting', () => {
      this.status = Reconnecting;
    });

    // When a single reconnect fails
    socket.on('reconnect_error', () => {
      this.status = ConnectFailed;
    });

    // When we can't reconnect at all
    socket.on('reconnect_failed', () => {
      this.status = ConnectFailed;
    });

    return socket;
  }
}

module.exports = HwProxyClient;
