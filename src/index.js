const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const axios = require('axios');
const ipc = electron.ipcRenderer;

const notifyBtn = document.getElementById('notifyBtn');
let price = document.querySelector('h1');
let targetPrice = document.getElementById('targetPrice');
let targetPriceVal;

const notification = {
  title: 'BTC Alert',
  body: 'BTC just beat your target price',
  icon: path.join(__dirname, '../assets/img/btc.png')
};

function getBTC() {
  axios
    .get(
      'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD'
    )
    .then(res => {
      const cryptos = res.data.BTC.USD;
      price.innerHTML = '$' + cryptos.toLocaleString('en');

      if (targetPrice.innerHTML != '' && targetPriceVal < cryptos) {
        const myNotification = new Notification(
          notification.title,
          notification
        );
      }
    });
}
getBTC();
setInterval(getBTC, 10000);

notifyBtn.addEventListener('click', event => {
  const modalPath = path.join('file://', __dirname, 'add.html');
  let win = new BrowserWindow({
    width: 400,
    height: 200,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true
    }
  });
  win.on('close', () => {
    win = null;
  });
  win.loadURL(modalPath);
  win.show();
});

ipc.on('targetPriceVal', (event, arg) => {
  targetPriceVal = Number(arg);
  targetPrice.innerHTML = '$' + targetPriceVal.toLocaleString('en');
});
