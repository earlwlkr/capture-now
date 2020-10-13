const puppeteer = require('puppeteer');
const cookies = require('./session');

async function initBrowser() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 },
  });
  const page = await browser.newPage();
  page.setCookie(...cookies);

  return { browser, page };
}

module.exports = initBrowser;
