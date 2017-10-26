const fs = require('fs');
const logger = require('digipolis-logger');
const correlationHelper = require('./utils/correlation-info');

if (!fs.existsSync('log')) {
  fs.mkdirSync('log');
}

logger.setConfig({
  console: {
    enable: true,
    level: 'info',
  },
  rotatingFile: {
    enabled: false,
    name: 'error-file',
    filename: 'log/error.log',
    level: 'error',
  },
  acpaas: {
    enabled: process.env.LOGGING_ENABLED === 'true',
    endpoint: process.env.LOGGING_API_URL,
    apikey: process.env.LOGGING_API_KEY,
    level: process.env.LOGGING_LEVEL,
    header: {
      index: process.env.LOGGING_HEADER_INDEX,
      version: process.env.LOGGING_HEADER_VERSION,
      correlation: {
        application: {
          applicationId: process.env.LOGGING_CORRELATION_APPLICATION_ID,
          applicationName: process.env.LOGGING_CORRELATION_APPLICATION_NAME,
        },
        instance: {
          instanceId: process.env.LOGGING_CORRELATION_INSTANCE_ID,
          instanceName: process.env.LOGGING_CORRELATION_INSTANCE_NAME,
        },
      },
      source: {
        application: {
          applicationId: process.env.LOGGING_SOURCE_APPLICATION_ID,
          applicationName: process.env.LOGGING_SOURCE_APPLICATION_NAME,
        },
        instance: {
          instanceId: process.env.LOGGING_SOURCE_INSTANCE_ID,
          instanceName: process.env.LOGGING_SOURCE_INSTANCE_NAME,
        },
        component: {
          componentId: process.env.LOGGING_SOURCE_COMPONENT_ID,
          componentName: process.env.LOGGING_SOURCE_COMPONENT_NAME,
        },
      },
    },
    body: {
      user: {
        userName: 'acpaas',
        ipAddress: '127.0.0.1',
      },
      message: {
        type: 'text',
        format: 'plain-text',
      },
      messageVersion: '1',
    },
  },
});

const Emitter = require('events').EventEmitter;

logger.socketLogger = (socket, next) => {
  const correlationInfo = correlationHelper();
  logger.info({
    socketId: socket.id,
    remoteAddress: socket.handshake.address,
    event: 'connection',
    handshake: socket.handshake,
  }, correlationInfo);
  socket.on('disconnect', () => {
    logger.info({
      socketId: socket.id,
      remoteAddress: socket.handshake.address,
      event: 'disconnection',
      handshake: socket.handshake,
    }, correlationInfo);
  });
  // eslint-disable-next-line no-param-reassign
  socket.onevent = (packet) => {
    const args = packet.data || [];
    if (packet.id != null) {
      args.push(this.ack(packet.id));
    }
    logger.info({
      socketId: socket.id,
      remoteAddress: socket.handshake.address,
      event: args[0] !== undefined ? args[0] : null,
      data: args[1] !== undefined ? args[1] : null,
    }, correlationInfo);
    return Emitter.prototype.emit.apply(this, args);
  };
  return next ? next() : null;
};

logger.requestLogger = (req, res, next) => {
  req.startTime = new Date();

  const { end } = res;
  res.end = (chunk, encoding) => {
    const responseTime = new Date() - req.startTime;
    res.end = end;
    res.end(chunk, encoding);
    logger.info({
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime,
    }, correlationHelper());
  };
  next();
};

module.exports = logger;
