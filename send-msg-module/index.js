const {
  sendText,
  createPoll,
  createTopic,
  sendImg,
  uploadImg,
} = require('./lib/utils');

class Msg {
  constructor(commonParams) {
    this.commonParams = commonParams;
  }

  sendText(params) {
    return sendText({
      params,
      commonParams: this.commonParams,
    });
  }
  createPoll(params) {
    return createPoll({
      params,
      commonParams: this.commonParams,
    });
  }
  createTopic(params) {
    createTopic(params, this.decryptKey, this.sessionKey);
  }
  sendImg(params) {
    sendImg(params, this.decryptKey, this.sessionKey);
  }

  uploadImg(params) {
    uploadImg(params, this.decryptKey, this.sessionKey);
  }
}

module.exports = Msg;
