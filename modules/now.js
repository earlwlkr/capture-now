const Storage = require('../lib/storage');
const NowApi = require('../lib/now');

let loggedIn = false;

async function goToNow(page, url) {
  if (!loggedIn) {
    console.log('do login');
    await page.goto('https://www.now.vn/account/login', {
      waitUntil: 'networkidle2',
    });
    const emailInput = await page.$(
      '#app > div > div.now-login > div > div.form-login-input > div.field-group > div:nth-child(1) > input[type=text]'
    );
    if (emailInput) {
      await emailInput.type('mike358015@gmail.com', { delay: 20 });
      const passwordInput = await page.$(
        '#app > div > div.now-login > div > div.form-login-input > div.field-group > div:nth-child(2) > input[type=password]'
      );

      await passwordInput.type(process.env.NOW_PW, { delay: 20 });
      const submitBtn = await page.$(
        '#app > div > div.now-login > div > div.form-login-input > button'
      );
      await submitBtn.click();
      await page.waitFor(5000);
      loggedIn = true;
      console.log('done login');
    }
  }
  await page.goto(url, { waitUntil: 'networkidle2' });
}

async function createOrder(page, vendorUrl) {
  await goToNow(page, vendorUrl);

  await page.waitForSelector('.btn-order-group');
  const createOrderElement = await page.$('.btn-order-group');
  await createOrderElement.click();

  await page.waitForSelector('.group-share-content input');
  const orderLinkElement = await page.$('.group-share-content input');
  const orderLink = await (
    await orderLinkElement.getProperty('value')
  ).jsonValue();
  console.log('orderLink', orderLink);
  return orderLink;
}

async function captureLatestReceipt(page) {
  await goToNow(page, 'https://www.now.vn/lich-su-dat-mon');
  await page.setViewport({
    width: 3000,
    height: 3000,
    deviceScaleFactor: 1,
  });

  await page.waitForSelector(
    '.history-table-cell.history-table-col8 .d-block.mb-1'
  );

  const orderCode = await page.evaluate(() => {
    const element = Array.from(
      document.querySelectorAll(
        '#app > div > div.block-section > div > div.history-table-container > div.history-table > div > div.history-table-cell.history-table-col3'
      )
    ).find(el => {
      const re = /(\d\d):\d\d/g;
      const content = el.textContent.toString();
      const match = re.exec(content);
      if (match && match[1]) {
        const hour = +match[1];
        if (hour && hour >= 10 && hour < 12) {
          return true;
        }
      }
      return false;
    });
    const detailButton = element.parentElement.querySelector('.d-block.mb-1');
    detailButton.click();
    const orderCode = element.parentElement.querySelector(
      '.history-table-cell.history-table-col2 > strong'
    ).textContent;
    return orderCode;
  });

  await page.waitFor(3000);
  await page.evaluate(() => {
    document.querySelector('.history-table-scroll').style.height = 'initial';
  });
  const captureElement = await page.$('.history-table.history-customer-order');
  const captureBuffer = await captureElement.screenshot();

  // const invoices = [];
  // const tableRows = await page.$$('.history-table-row');
  // for (let row of tableRows) {
  //   let listItemElement = await row.$('.customer-order-name');
  //   let listItemValueElement = await row.$(
  //     '.history-table-cell.history-table-col7'
  //   );
  //   if (!listItemElement || !listItemValueElement) continue;
  //   const name = (
  //     await (await listItemElement.getProperty('textContent')).jsonValue()
  //   ).replace('[Host]', '');
  //   let value = await (
  //     await listItemValueElement.getProperty('textContent')
  //   ).jsonValue();
  //   value = parseFloat(value.replace(',', '.'));
  //   invoices.push({ name, value });
  // }
  // console.log('invoices', invoices);

  console.log('orderCode', orderCode);
  const order = await getOrderDetail(orderCode);

  return [order, captureBuffer];
}

async function getOrderDetail(orderCode) {
  const orderDetails = await NowApi.getOrderDetail(orderCode);
  const order = formatOrderDetails(orderDetails);
  return order;
}

function formatOrderDetails(details) {
  return {
    id: details.id + '',
    code: details.code,
    receipt: '',
    orderTime: details.order_time,
    deliveryTime: details.delivery_time,
    restaurant: {
      id: details.order_items[0].restaurant.id,
      name: details.order_items[0].restaurant.name,
      url: '',
      distance: 0,
    },
    subTotal: details.order_value.value,
    ship: details.final_shipping_fee.value,
    total: details.final_value.value,
    userItems: details.order_items[0].orders.user_order.map(userOrder => {
      return {
        id: userOrder.user.id + '',
        name: userOrder.user.name,
        photo: userOrder.user.photos[userOrder.user.photos.length - 1].value,
        pay: userOrder.must_pay_amount.value,
        orderItems: userOrder.order_dishes.map(orderDish => {
          return {
            id: orderDish.dish.id,
            name: orderDish.dish.name,
            photo:
              orderDish.dish.photos[orderDish.dish.photos.length - 1].value,
            price: orderDish.dish.price.value,
            quantity: orderDish.quantity,
          };
        }),
      };
    }),
  };
}

module.exports = {
  captureLatestReceipt,
  createOrder,
};
