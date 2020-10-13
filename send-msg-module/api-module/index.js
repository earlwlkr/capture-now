const { doCallApi } = require('./utils');

class ApiCall {
  constructor(decryptKey, sessionKey) {
    this.decryptKey = decryptKey;
    this.sessionKey = sessionKey;
  }
  doCallApi(endPoint, params) {
    return doCallApi(endPoint, params, this.decryptKey, this.sessionKey);
  }
}

module.exports = ApiCall;
