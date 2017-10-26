const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
const logger = require('./logger');

const app = express();
const server = require('http').Server(app);

const io = require('socket.io')(server);

app.use(logger.requestLogger);

app.use(helmet());
if (process.env.NODE_ENV !== 'development') {
  app.use(compression());
}
app.use(bodyParser.json({ limit: '4096kb' }));

// eslint-disable-next-line import/no-dynamic-require, global-require
require('glob').sync('./routes/*.js').forEach(file => require(file)(app));

app.use(require('digipolis-error').middleware({ logger }));

io.use(logger.socketLogger);
io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    io.sockets.emit('message', msg);
  });
});

module.exports = server;
