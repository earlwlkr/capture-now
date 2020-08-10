require('dotenv').config();

const Storage = require('../lib/storage');
const data = require('../migrate/orders');

async function addOrderHistory(order) {
  return Storage.add('orders', order);
}

(async () => {
  for (let order of data) {
    order.id = order.id + '';
    for (let userItem of order.userItems) {
      userItem.id = userItem.id + '';
    }
    await addOrderHistory(order);
  }
})();
