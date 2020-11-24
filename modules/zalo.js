const ZaloClient = require('zalo-client');

const msg = new ZaloClient({
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

//async function sendText(page, convName, text) {
async function sendText({ convId, text }) {
  // await redirectTo(page, 'https://chat.zalo.me');
  // await selectConv(page, convName);

  // await page.waitForSelector(SELECTORS.msgInput);
  // await page.focus(SELECTORS.msgInput);
  // await page.keyboard.sendCharacter(text);

  // const textInput = await page.$(SELECTORS.msgInput);
  // //   await textInput.type(text, { delay: 20 });

  // await textInput.press('Enter');
  // await page.waitFor(2000);

  const params = {
    clientId: Date.now(),
    grid: convId,
    message: text,
    visibility: 0,
  };

  return msg.sendText(params);
}

// async function createPoll(page, convName, pollTitle, pollOptions) {
async function createPoll({
  convId,
  question,
  expiredTime = 0,
  options = [],
  allowAddOption = true,
  allowMutiChoices = true,
}) {
  // await redirectTo(page, 'https://chat.zalo.me');
  // await selectConv(page, convName);

  // console.log('createPoll', convName, pollTitle);
  // await page.waitFor(SELECTORS.moreInputBtn);
  // const moreInput = await page.$(SELECTORS.moreInputBtn);
  // await moreInput.click();
  // await page.evaluate(() => {
  //   const element = Array.from(
  //     document.querySelectorAll('.menu-more-option')
  //   ).find(el => el.textContent.toString().indexOf('Tạo bình chọn') !== -1);
  //   element.click();
  // });

  // const pollTitleElement = await page.$(SELECTORS.pollTitleInput);
  // await pollTitleElement.type(pollTitle, { delay: 20 });

  // let pollOptionIndex = 0;
  // const pollInputSelector = SELECTORS.pollOptionInput;
  // let pollInputElement = await page.$(pollInputSelector);
  // await pollInputElement.type(pollOptions[pollOptionIndex++], { delay: 20 });

  // while (pollOptionIndex < pollOptions.length) {
  //   const pollInputElements = await page.$$(pollInputSelector);
  //   await pollInputElements[pollInputElements.length - 1].type(
  //     pollOptions[pollOptionIndex++],
  //     { delay: 20 }
  //   );
  // }
  // await page.evaluate(() => {
  //   const element = Array.from(document.querySelectorAll('.btn')).find(
  //     el => el.textContent.toString().indexOf('Tạo bình chọn') !== -1
  //   );
  //   element.click();
  // });
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

  return msg.createPoll(params);
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
