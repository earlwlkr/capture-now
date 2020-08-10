function shuffle(array) {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function getDateString(date = new Date()) {
  const weekDays = [
    'Chủ nhật',
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
  ];
  const str = `${weekDays[date.getDay()]}, ${date.getDate()}/${
    date.getMonth() + 1
  }`;
  return str;
}

function getShortWeekdayString(date) {
  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return weekDays[date.getDay()];
}

function getShortDateString(date) {
  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const str = `${weekDays[date.getDay()]}, ${date.getDate()}/${
    date.getMonth() + 1
  }`;
  return str;
}

function currencyFormat(value) {
  if (!value && value !== 0) {
    return '';
  }
  return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.');
}

module.exports = {
  shuffle,
  getDateString,
  getShortWeekdayString,
  getShortDateString,
  currencyFormat,
};
