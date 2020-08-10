function get(url) {
  return fetch(url).then(r => r.json());
}

function post(url, data) {
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data),
  }).then(r => r.json());
}

module.exports = {
  get,
  post,
};
