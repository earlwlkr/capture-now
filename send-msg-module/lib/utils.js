const ApiCall = require('../api-module/index');

const ENDPOINT_TEXT = {
  GROUP: 'https://group-wpa.chat.zalo.me/api/group/sendmsg?',
  ONE: 'https://chat2-wpa.chat.zalo.me/api/message/sms?',
};
const ENDPOINT_POLL = 'https://group-wpa.chat.zalo.me/api/poll/create?';
const ENDPOINT_TOPIC =
  'https://groupboard-wpa.chat.zalo.me/api/board/topic/create?';

const ENDPOINT_IMAGE =
  'https://files-wpa.chat.zalo.me/api/group/photo_original/send?';

const ENDPOINT_UPLOAD =
  'https://files-wpa.chat.zalo.me/api/group/photo_original/upload?';
// const ENDPOINT_UPLOAD = "https://files-wpa.chat.zalo.me/api/message/photo?";
// const ENDPOINT_UPLOAD =
//   "https://files-wpa.chat.zalo.me/api/message/sharefile_full?";

function sendText({ params, commonParams }) {
  const apiCall = new ApiCall(commonParams);
  const isGroup = params.hasOwnProperty('grid');
  const endPoint = isGroup ? ENDPOINT_TEXT.GROUP : ENDPOINT_TEXT.ONE;

  return apiCall.doCallApi(endPoint, params);
}

function createPoll({ params, commonParams }) {
  const apiCall = new ApiCall(commonParams);
  const isGroup = params.hasOwnProperty('group_id');
  const endPoint = ENDPOINT_POLL;

  if (!isGroup) return;
  return apiCall.doCallApi(endPoint, params);
}

function createTopic(params, decryptKey, sessionKey) {
  const apiCall = new ApiCall(decryptKey, sessionKey);
  const endPoint = ENDPOINT_TOPIC;

  apiCall.doCallApi(endPoint, params);
}

function sendImg(params, decryptKey, sessionKey) {
  const apiCall = new ApiCall(decryptKey, sessionKey);
  const endPoint = ENDPOINT_IMAGE;

  apiCall.doCallApi(endPoint, params);
}

function uploadImg(params, decryptKey, sessionKey) {
  const apiCall = new ApiCall(decryptKey, sessionKey);
  const endPoint = ENDPOINT_UPLOAD;

  apiCall.doCallApi(endPoint, params);
}

module.exports = {
  sendText,
  createPoll,
  createTopic,
  sendImg,
  uploadImg,
};
