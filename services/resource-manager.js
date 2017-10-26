const errors = require('errors'); // Using digipolis-errors
const uuid = require('../utils/uuid');
const HwProxyClient = require('./hwproxy');

class ResourceManager {
  constructor() {
    this.connections = {};
  }

  getList() {
    return Object.keys(this.connections).map(k => ({
      id: this.connections[k].id,
      type: this.connections[k].type,
    }));
  }

  getByType(type) {
    const res = this.getList().find(x => x.type === type);
    if (res === undefined) {
      throw new errors.GoneError();
    }
    return res;
  }

  getConnection(id) {
    if (!(id in this.connections)) {
      throw new errors.NotFoundError();
    }
    return id;
  }

  getStatus(id) {
    return this.getConnection(id).status;
  }

  connectHwProxy(url, opts) {
    const id = uuid(url);
    const client = new HwProxyClient(id, url, opts);
    this.connections[id] = client;
    return id;
  }
}

let instance = null;
function get() {
  if (instance === null) {
    instance = new ResourceManager();
  }
  return instance;
}
module.exports = { get, ResourceManager };
