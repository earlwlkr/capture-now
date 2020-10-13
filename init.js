const puppeteer = require('puppeteer');
const cookies = require('./session');
const Msg = require('./send-msg-module');

async function initBrowser() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
  });
  const page = await browser.newPage();
  page.setCookie(...cookies);

  const msg = new Msg(DECRYPT_KEY_VALUE, SESSION_KEY);
  return { browser, page, msg };
}

module.exports = initBrowser;
