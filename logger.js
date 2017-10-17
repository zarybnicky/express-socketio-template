const fs = require('fs');
const { Logger, transports: { Console, File } } = require('winston');
const expressWinston = require('express-winston');
const socketWrapper = require('socketio-winston-logger');


if (!fs.existsSync('log')) {
  fs.mkdirSync('log');
}

const socketLogger = socketWrapper(new Logger({
  transports: [
    new Console({ colorize: true }),
    new File({ filename: 'log/socket.log' }),
  ],
}));

const accessLogger = expressWinston.logger({
  transports: [
    new Console({ colorize: true }),
    new File({ filename: 'log/access.log' }),
  ],
});

const errorLogger = expressWinston.errorLogger({
  transports: [
    new Console({ colorize: true }),
    new File({ filename: 'log/error.log' }),
  ],
});

module.exports = {
  socketLogger,
  accessLogger,
  errorLogger,
};
