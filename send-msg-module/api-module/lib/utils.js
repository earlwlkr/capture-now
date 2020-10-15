const crypto = require('crypto');
const axios = require('axios');

function constructUrlParams(obj) {
  let temp = [];
  for (let k in obj) {
    if (obj.hasOwnProperty(k)) {
      temp.push(k + '=' + encodeURIComponent(obj[k]));
    }
  }
  return temp.join('&');
}

function encodeAES(data, encryptKey) {
  let iv = Buffer.from('0'.repeat(32), 'hex'),
    plaintext = new Buffer(data),
    cipher = crypto.createCipheriv(
      'aes-128-cbc',
      Buffer.from(encryptKey, 'base64'),
      iv
    ),
    ciphertext = cipher.update(plaintext);
  ciphertext = Buffer.concat([ciphertext, cipher.final()]);
  return ciphertext.toString('base64');
}

function decodeAES(data, encryptKey) {
  data = decodeURIComponent(data);
  let iv = Buffer.from('0'.repeat(32), 'hex'),
    input = Buffer.from(data, 'base64'),
    key = Buffer.from(encryptKey, 'base64'),
    decipher = crypto.createDecipheriv('aes-128-cbc', key, iv),
    ciphertext = Buffer.concat([decipher.update(input), decipher.final()]);

  resp = ciphertext.toString('utf-8');
  return resp;
}

// function doRequest(url, form) {
//   // return axios.get(url);

//   // testing upload photo
//   return axios.post(url, form);
// }

function doRequest(url) {
  return axios.get(url);
}

function doCallApi({ endPoint, params, commonParams }) {
  let url = endPoint;
  const { decryptKey, ...restCommonParams } = commonParams;
  const newCommonParams = { zpw_ver: restCommonParams.zpwVersion, zpw_type: restCommonParams.zpwType, zpw_sek: restCommonParams.sessionKey };
  url += constructUrlParams(newCommonParams)
    + '&params=' +
    encodeURIComponent(encodeAES(JSON.stringify(params), decryptKey)) +
    '&type=11'; // cho gui file

  // testing upload photo
  // const fs = require('fs');
  // fs.readFile('./1kbimage.jpg', function (err, data) {
  //   const FormData = require('form-data');
  //   const form = new FormData();
  //   form.append('chunkContent', data, '1kbimage.jpg');
  //   return doRequest(url, form)
  //     .then((res) => {
  //       console.log('-------------response----------------');
  //       console.log('request res', res);
  //       const decoded = decodeAES(res.data.data, decryptKey);
  //       const parsedRes = JSON.parse(decoded);
  //       console.log('-------------data response----------------');
  //       console.log('request parsedRes', parsedRes);
  //       return parsedRes;
  //     })
  //     .catch((err) => {
  //       console.error('request error', err);
  //     });
  // });

  // return doRequest(url)
  //   .then(res => {
  //     const decoded = decodeAES(res.data.data, decryptKey);
  //     const parsedRes = JSON.parse(decoded);
  //     console.log('request parsedRes', parsedRes);
  //     return parsedRes;
  //   })
  //   .catch(err => {
  //     console.error('request error', err);
  //   });

  return new Promise((resolve, reject) => {
    doRequest(url)
      .then(res => {
        console.log('request res', res);
        const decoded = decodeAES(res.data.data, decryptKey);
        const parsedRes = JSON.parse(decoded);
        console.log('request parsedRes', parsedRes);
        resolve(parsedRes);
      })
      .catch(err => {
        reject(err);
      });
  });
}

module.exports = {
  constructUrlParams,
  encodeAES,
  decodeAES,
  doRequest,
  doCallApi,
};
