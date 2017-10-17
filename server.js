const express = require('express');
const { socketLogger, accessLogger, errorLogger } = require('./logger');
const router = require('./router');

const app = express();
const server = require('http').Server(app);

const io = require('socket.io')(server);

io.use(socketLogger);

// For more REST middleware see https://github.com/senchalabs/connect#middleware
app.use(accessLogger);
app.use(router);
app.use(errorLogger);

io.on('connection', (socket) => {
  socket.on('message', (msg) => {
    io.sockets.emit('message', msg);
  });
});

module.exports = server;
