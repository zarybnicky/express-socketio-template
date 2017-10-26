const os = require('os');
const ip = require('ip');
const uuid = require('./uuid');

function generate(userId) {
  return {
    id: uuid(),
    sourceId: process.env.APPLICATION_CODE,
    sourceName: process.env.LOGGING_HEADER_INDEX,
    instanceId: os.hostname(),
    instanceName: os.hostname(),
    userId: userId || os.homedir(),
    ipAddress: ip.address(),
  };
}

function toBase64(correlationInfo) {
  return Buffer.from(JSON.stringify(correlationInfo)).toString('base64');
}

module.exports = { generate, toBase64 };
