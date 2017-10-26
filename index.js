const server = require('./server');
const logger = require('./logger');
const correlationInfo = require('./utils/correlation-info');

const port = process.env.PORT || 3000;
server.listen(port, () => {
  logger.info(`Server started listening on port ${port}`, correlationInfo());
});
