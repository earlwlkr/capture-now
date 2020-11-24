const ZaloClient = require('zalo-client');

const zaloClient = new ZaloClient({
  decryptKey: process.env.ZALO_ENCRYPT_KEY,
  sessionKey: process.env.ZALO_SESSION_KEY,
  zpwVersion: 63,
  zpwType: 30,
});

const SELECTORS = {
  signInAvatar: '.avatar.otr-2',
  msgInput: '#richInput',
  moreInputBtn: '.btn.btn--s.fa.fa-chatbar-icon-more-input.text-center',
  moreMenuOption: '.menu-more-option',
  pollElement: '.group-poll-info-body',
  pollTitleInput: '.group-poll-create-question',
  pollOptionInput: '.group-poll-create-content-item-input',
  mostVotedItem:
    '/html/body/div/div/div[6]/div/div/div[2]/div/div/div[1]/div/div[1]/div[3]/div[2]/div[2]/span',
};

async function redirectTo(page, url) {
  if (page.url().startsWith(url)) {
    return;
  }
  await page.goto(url, { waitUntil: 'networkidle2' });
  try {
    await page.waitFor('.avatar');
    const signInAvatar = await page.$(SELECTORS.signInAvatar);
    if (signInAvatar) {
      await signInAvatar.click();
    } else {
      console.log('try finding pw input');
      const signInPassword = await page.$('input[type=password]');
      if (signInPassword) {
        await signInPassword.type(process.env.ZALO_PW);
        console.log('typing pw');
        const signInBtn = await page.$(
          '#app > div > div.zLogin-layout.parentDisable > div.body > div > div > div > div > div > div:nth-child(1) > div > div > div > div > div.textAlign-center.has-2btn > a'
        );
        if (signInBtn) {
          await signInBtn.click();
        }
      }
    }
  } catch (e) {
    console.log('redirectTo error', e);
  }
}

async function selectConv(page, convName) {
  console.log('selectConv', convName);
  const selector = `//*[@id="conversationListId"]/div[2]/div/div[1]/div/div/div/div/div[contains(., '${convName}')]`;
  await page.waitForXPath(selector);
  const convElement = (await page.$x(selector))[0];
  await convElement.click();
}

async function uploadPhotoToConv(page, convName, filePath) {
  await redirectTo(page, 'https://chat.zalo.me');
  await selectConv(page, convName);

  await page.waitForSelector('.inputfile');
  const dropZoneInput = await page.$('.inputfile');
  dropZoneInput.uploadFile(filePath);
}

async function sendText({ convId, text }) {
  const params = {
    clientId: Date.now(),
    grid: convId,
    message: text,
    visibility: 0,
  };

  return zaloClient.sendText(params);
}

async function createPoll({
  convId,
  question,
  expiredTime = 0,
  options = [],
  allowAddOption = true,
  allowMutiChoices = true,
}) {
  const params = {
    allow_add_new_option: allowAddOption,
    allow_multi_choices: allowMutiChoices,
    expired_time: expiredTime,
    group_id: convId,
    is_anonymous: false,
    options,
    poll_type: 0,
    question,
    src: 1,
  };

  return zaloClient.createPoll(params);
}

async function getMostVoted(page, convName) {
  await redirectTo(page, 'https://chat.zalo.me');
  await selectConv(page, convName);

  await page.waitForSelector(SELECTORS.pollElement);
  const poll = await page.$(SELECTORS.pollElement);
  await poll.click();

  await page.waitForSelector('.group-poll-vote-content-item');
  const mostVoted = (await page.$x(SELECTORS.mostVotedItem))[0];
  const value = await (await mostVoted.getProperty('textContent')).jsonValue();

  console.log('mostVoted', value);
  return value;
}

module.exports = {
  uploadPhotoToConv,
  sendText,
  createPoll,
  getMostVoted,
};
