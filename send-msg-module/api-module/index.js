const { doCallApi } = require('./lib/utils');

class ApiCall {
  constructor(commonParams) {
    this.commonParams = commonParams;
  }
  doCallApi(endPoint, params) {
    return doCallApi({
      endPoint,
      params,
      commonParams: this.commonParams,
    });
  }
}

module.exports = ApiCall;
