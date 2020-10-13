const {
  sendText,
  createPoll,
  createTopic,
  sendImg,
  uploadImg,
} = require('./lib/utils');

class Msg {
  constructor(decryptKey, sessionKey) {
    this.decryptKey = decryptKey;
    this.sessionKey = sessionKey;
  }

  sendText(params) {
    return sendText(params, this.decryptKey, this.sessionKey);
  }
  createPoll(params) {
    createPoll(params, this.decryptKey, this.sessionKey);
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
