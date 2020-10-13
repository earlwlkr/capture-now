const API_ENDPOINT = 'https://group-wpa.chat.zalo.me/api/group/delivered?';
const API_PARAMS = {
  msg_ids: ['2100547389348'],
  grid: '3754004261213803353',
  seen: 0,
};

const DECRYPT_KEY = 'Csw11weR8NuOMWJMspk6Ew==';
const ZPW_SEK =
  'bvRs.202637136.a0.caEha4bz52iPWWSdQ7qKAp9VSK1hHpPeEWeb6ZuOHXC725jc7ZTPM3aM8cu-G2a9D1hXrrh3TQOsVAlkkoCKAm';

module.exports = {
  // ZCommon.getSecretKey()
  secretKey: DECRYPT_KEY,
  // zpw_sek cookie
  sessionKey: ZPW_SEK,
  apiVer: '59',
  apiType: '30',

  apiEndpoint: API_ENDPOINT,
  apiParams: API_PARAMS,
};
