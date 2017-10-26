const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');
const uuidv5 = require('uuid/v5');

const namespace = uuidv1();

module.exports = (name = null) => {
  if (name === null) {
    return uuidv4();
  }
  return uuidv5(name, namespace);
};
