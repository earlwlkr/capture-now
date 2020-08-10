require('dotenv').config();

const initBrowser = require('../init');
const now = require('../modules/now');
const Storage = require('../lib/storage');
const Bucket = require('../lib/bucket');

async function addOrderHistory(order) {
  return Storage.add('orders', order);
}

async function uploadReceiptImage(fileName, buffer) {
  const [err, data] = await Bucket.update(
    process.env.S3_RECEIPTS_BUCKET_NAME,
    fileName,
    buffer
  );
  if (err) {
    console.error('uploadReceiptImage error', err);
  }
  return 'https://grabbot-receipts.s3-ap-southeast-1.amazonaws.com/' + fileName;
}

(async () => {
  const { browser, page } = await initBrowser();

  const [order, captureBuffer] = await now.captureLatestReceipt(page);
  // await zalo.uploadPhotoToConv(page, null, filePath);

  const orderDate = new Date(order.orderTime);
  const dateString = `${orderDate.getDate()}_${
    orderDate.getMonth() + 1
  }_${orderDate.getFullYear()}`;
  const fileName = `now_order_${dateString}.png`;
  order.receipt = await uploadReceiptImage(fileName, captureBuffer);

  await addOrderHistory(order);

  await browser.close();
})();
