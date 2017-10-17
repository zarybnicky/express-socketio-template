/* globals describe, it, beforeEach, afterEach, before, after */

const server = require('../server');
const should = require('should');
const io = require('socket.io-client');
const net = require('net');

// Find a free port
function getPort(cb) {
  let portRange = 45032;
  const port = portRange;
  portRange += 1;

  const testServer = net.createServer();
  testServer.listen(port, () => {
    testServer.once('close', () => cb(port));
    testServer.close();
  });
  testServer.on('error', () => getPort(cb));
}

const ioOptions = {
  transports: ['websocket'],
  forceNew: true,
  reconnection: false,
};
let port;
let sender;
let receiver;

describe('Chat Events', () => {
  before((done) => {
    getPort((found) => {
      port = found;
      server.listen(port);
      done();
    });
  });
  after((done) => {
    server.close();
    done();
  });

  beforeEach((done) => {
    sender = io(`http://localhost:${port}/`, ioOptions);
    receiver = io(`http://localhost:${port}/`, ioOptions);
    done();
  });

  afterEach((done) => {
    sender.disconnect();
    receiver.disconnect();
    done();
  });

  describe('Message Events', () => {
    it('Clients should receive a message when the `message` event is emited.', (done) => {
      sender.emit('message', 'HelloWorld');
      receiver.on('message', (msg) => {
        should(msg).be.exactly('HelloWorld');
        done();
      });
    });
  });
});
