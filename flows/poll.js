const initBrowser = require('../init');
const zalo = require('../modules/zalo');
const NowApi = require('../lib/now');
const utils = require('../lib/utils');

async function doPoll(
  convName,
  vendors,
  pollDuration,
  pollTitle,
  orderText,
  orders
) {
  console.log('doPoll', convName, vendors.length);
  const { browser, page } = await initBrowser();

  let preface = '';
  const vendorStats = new Map();

  if (orders && orders.length) {
    orders.sort((a, b) => {
      return new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime();
    });
    const unpaid = orders[0].userItems.filter(i => !i.paid);
    if (unpaid.length > 0) {
      const receiptPath = 'https://tabber.vercel.app/orders';
      preface = `Còn ${
        unpaid.length
      } phần chưa được thanh toán cho ${utils.getDateString(
        new Date(orders[0].orderTime)
      )}: ${receiptPath}`;
    }
    for (let order of orders) {
      const { restaurant, ship, orderTime, deliveryTime } = order;
      const stats = vendorStats.get(restaurant.name) || {
        avgShipping: 0,
        avgDuration: 0,
        times: 0,
      };
      stats.times += 1;
      stats.avgShipping =
        (stats.avgShipping * (stats.times - 1) + ship) / stats.times;
      stats.avgDuration = Math.round(
        (stats.avgDuration * (stats.times - 1) +
          Math.round((new Date(deliveryTime) - new Date(orderTime)) / 60000)) /
          stats.times
      );
      vendorStats.set(restaurant.name, stats);
    }
  }

  let parsed = vendors.slice();
  parsed.sort((a, b) => {
    let statsA = vendorStats.get(a.name);
    let statsB = vendorStats.get(b.name);
    let timesA = statsA ? statsA.times : 0;
    let timesB = statsB ? statsB.times : 0;
    return timesB - timesA;
  });
  // const parsed = utils.shuffle(vendors);
  const vendorNames = parsed.map(i => i.name);
  const vendorLinks = parsed.map(i => i.link);

  const vendorDesc = vendorNames
    .reduce((prev, name, i) => {
      const vendorStat = vendorStats.get(name);
      let statStr = '';
      if (vendorStat) {
        const { avgShipping, avgDuration, times } = vendorStat;
        statStr += ` (đã đặt ${times} lần, ship ${utils.currencyFormat(
          Math.round(avgShipping)
        )}đ, ${avgDuration} phút)`;
      }
      prev += '\n' + name + statStr + ' ' + vendorLinks[i];
      return prev;
    }, '')
    .trim();

  await zalo.sendText(page, convName, vendorDesc);
  await zalo.createPoll(page, convName, pollTitle, vendorNames);
  const pollCloseTime = new Date(Date.now() + pollDuration * 60000);
  await zalo.sendText(
    page,
    convName,
    `Mọi người chọn quán cho ${utils.getDateString()}, chốt lúc ${pollCloseTime.getHours()}:${pollCloseTime.getMinutes()}.`
  );
  if (preface) {
    await page.waitFor(200);
    await zalo.sendText(page, convName, preface);
  }
  console.log('waiting for', pollDuration);
  await page.waitFor(pollDuration * 60000);

  const mostVotedValue = await zalo.getMostVoted(page, convName);
  const mostVotedIndex = vendorNames.indexOf(mostVotedValue);
  const vendorUrl = vendorLinks[mostVotedIndex];
  const vendorName = vendorNames[mostVotedIndex];
  console.log('vendorUrl', vendorUrl);
  const orderUrl = await NowApi.createGroupOrderFromUrl(vendorUrl);

  const vendorStat = vendorStats.get(vendorName);
  let finalOrderText = `${orderText}\n${vendorName}\n`;
  if (vendorStat) {
    const { avgShipping, avgDuration, times } = vendorStat;
    finalOrderText += `Số lần đặt ở quán: ${times}\nThời gian giao trung bình: ${avgDuration} phút\nPhí ship trung bình: ${utils.currencyFormat(
      Math.round(avgShipping)
    )}đ`;
  }
  finalOrderText += `\n${orderUrl}\n`;
  console.log('finalOrderText', finalOrderText);
  await zalo.sendText(page, convName, finalOrderText);

  await browser.close();
}

module.exports = doPoll;
