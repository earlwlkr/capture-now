require('dotenv').config();

const doPoll = require('./poll');
const utils = require('../lib/utils');
const config = require('../config');
const Bucket = require('../lib/bucket');

const POLL_DURATION = config.SNACK_POLL_DURATION_IN_MINUTES;
const CONVERSATION_NAME = 'Ăn vặt hội';
const CONVERSATION_ID = config.CONV_ID;

const POLL_TITLE = `Đặt ăn vặt ${utils.getDateString()}`;
const ORDER_TEXT = `Mọi người đặt ăn vặt cho ${utils.getDateString()}:`;

const vendorFilePath = 'sub-vendors.json';

async function createSnackPoll() {
  const [err, vendors] = await Bucket.get(
    process.env.S3_BUCKET_NAME,
    vendorFilePath
  );
  if (err) {
    return console.error(err);
  }

  doPoll(CONVERSATION_NAME, vendors, POLL_DURATION, POLL_TITLE, ORDER_TEXT, [], CONVERSATION_ID);
}

createSnackPoll();
