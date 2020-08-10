require('dotenv').config();

const doPoll = require('./poll');
const utils = require('../lib/utils');
const config = require('../config');
const Storage = require('../lib/storage');
const Bucket = require('../lib/bucket');

const POLL_DURATION = config.LUNCH_POLL_DURATION_IN_MINUTES;
const CONVERSATION_NAME = config.CONV_NAME;

const POLL_TITLE = `Đặt món ${utils.getDateString()}`;
const ORDER_TEXT = `Mọi người đặt món cho ${utils.getDateString()}:`;

const vendorFilePath = 'vendors.json';

async function createLunchPoll() {
  const [err, vendors] = await Bucket.get(
    process.env.S3_BUCKET_NAME,
    vendorFilePath
  );
  if (err) {
    return console.error(err);
  }
  const [ordersErr, orders] = await Storage.list('orders');

  doPoll(
    CONVERSATION_NAME,
    vendors,
    POLL_DURATION,
    POLL_TITLE,
    ORDER_TEXT,
    orders
  );
}

createLunchPoll();
