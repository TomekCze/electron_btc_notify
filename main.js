const { app, BrowserWindow, Menu } = require('electron');
const shell = require('electron').shell;
const ipc = require('electron').ipcMain;
// Zachowaj globalną referencję obiektu okna, jeśli tego nie zrobisz, okno
// zostanie zamknięte automatycznie, gdy obiekt JavaScript odśmieci pamięć.
let win;

function createWindow() {
  // Stwórz okno przeglądarki.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  win.loadFile('src/index.html');

  // Otwórz Narzędzia Deweloperskie.
  win.webContents.openDevTools();

  // Emitowane, gdy okno jest zamknięte.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  let menu = Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {
          label: 'Adjust Notification Value'
        },
        {
          label: 'CoinMarketCap',
          click() {
            shell.openExternal('http://coinmarketcap.com');
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          click() {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Info'
    }
  ]);

  Menu.setApplicationMenu(menu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//app.setAppUserModelId('crypto.app.id');
//app.setAppUserModelId(process.execPath);
app.on('ready', createWindow);

// Zamknij, gdy wszystkie okna są zamknięte.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

ipc.on('update-notify-value', (event, arg) => {
  win.webContents.send('targetPriceVal', arg);
});
