const fetch = require('node-fetch');

const FOODY_ACCESS_TOKEN = process.env.FOODY_ACCESS_TOKEN;
const DEBUG = false;

const { Headers } = fetch;

function debug(...params) {
  if (DEBUG) {
    console.log(...params);
  }
}

async function getOrderDetail(orderCode) {
  const result = await callNowApi(
    '/order/get_single_group_detail?order_code=' + orderCode
  );
  return result;
}

async function getDeliveryIdFromUrl(restaurantUrl) {
  const url = restaurantUrl.split('/').slice(-2).join('/');
  const result = await callNowApi('/delivery/get_from_url?url=' + url);
  const deliveryId = result.delivery_id;
  return deliveryId;
}

async function createGroupOrder(deliveryId) {
  const result = await callNowApi('/cart/create_group', 'POST', {
    delivery_id: deliveryId,
  });
  return result;
}

async function createGroupOrderFromUrl(restaurantUrl) {
  const deliveryId = await getDeliveryIdFromUrl(restaurantUrl);
  const result = await createGroupOrder(deliveryId);
  const groupOrderCode = result.code;
  const groupOrderUrl = `https://now.vn/ho-chi-minh/${result.delivery.url_rewrite_name}/?t=${groupOrderCode}`;
  return groupOrderUrl;
}

async function callNowApi(endpoint, method = 'GET', payload = {}) {
  const BASE_API_URL = 'https://gappapi.deliverynow.vn/api';
  const nowHeaders = new Headers();
  nowHeaders.append('x-foody-access-token', FOODY_ACCESS_TOKEN);
  nowHeaders.append('x-foody-api-version', ' 1');
  nowHeaders.append('x-foody-app-type', ' 1004');
  nowHeaders.append('x-foody-client-id', '');
  nowHeaders.append('x-foody-client-type', ' 1');
  nowHeaders.append('x-foody-client-version', ' 3.0.0');

  const requestOptions = {
    method,
    headers: nowHeaders,
    redirect: 'follow',
    body: method === 'POST' ? JSON.stringify(payload) : null,
  };

  const response = await fetch(BASE_API_URL + endpoint, requestOptions);
  const json = await response.json();
  debug(json.reply);
  return json.reply;
}

module.exports = {
  getOrderDetail,
  createGroupOrderFromUrl,
};
