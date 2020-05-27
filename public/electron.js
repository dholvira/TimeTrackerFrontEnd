const {
  app,
  BrowserWindow,
  webContents,
  powerMonitor,
  globalShortcut
} = require('electron');

const path = require('path');
const isDev = require('electron-is-dev');
// const gkm = require('gkm');
// const ioHook = require('iohook');
const { ipcMain } = require('electron');

// const prepareKey = require('./prepareKey');
// const sendPack = require('./sendPack');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1300,
    height: 800,
    minHeight: 300,
    minWidth: 300,
    frame: false,
    icon: path.join(__dirname + '/icons/mac/bb.png'),
    titleBarStyle: 'hidden',
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      backgroundThrottling: false,
      preload: __dirname + '/preload.js'
    }
  });

  // and load the index.html of the
  //   win.loadFile('index.html')
  win.loadURL(
    isDev
      ? 'http://localhost:3001'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  // win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`);
  const shortcut = globalShortcut.register('Control+Space', () => {
    win.show();
  });
  // Open the DevTools.
  win.webContents.openDevTools();

  let wc = win.webContents;

  wc.on('dom-ready', () => {
    console.log('dom ready');
  });

  wc.on('did-finish-load', () => {
    console.log('content fully loaded');
  });

  // const { powerMonitor } = require('electron');
  var IdleActivity = function() {
    // console.log(logger, 'Sending data to your API...');
    var log = 0;
    log = powerMonitor.getSystemIdleTime();
    if (log > 58) {
      // setInterval(function() {
      win.show();
      wc.send('message', {
        alert: 'Your break will automatically start in 10 seconds..'
      });
      console.log('inactive');
      // }, 3000);
    } else {
      console.log('active');
      // wc.send('message', { alert: 'Active' });
    }

    // logger = '';

    // console.log('idle time', powerMonitor.getSystemIdleTime());
  };
  var IdleTimer = function() {
    // console.log(logger, 'Sending data to your API...');
    var logs = 0;
    logs = powerMonitor.getSystemIdleTime();
    if (logs > 9) {
      // setInterval(function() {
      // win.show();
      wc.send('initiateBreak', {
        alert: 'Starting Break'
      });
      // console.log('start break');
      // }, 3000);
    } else {
      console.log('user active');
      wc.send('breakAvoided', { alert: 'Break Avoided' });
      console.log('break avoided');
      // wc.send('message', { alert: 'Active' });
    }

    // logger = '';

    // console.log('idle time', powerMonitor.getSystemIdleTime());
  };
  // var checkIdleTimer = setInterval(IdleActivity, 20000);
  let checkIdleTimer = [];
  let checkCounter = [];
  ipcMain.on('breakStart', async (event, arg) => {
    win.setFullScreen(true);

    // await clearInterval(checkIdleTimer);
    for (var i = 0; i < checkIdleTimer.length; i++) {
      clearInterval(checkIdleTimer[i]);
    }

    event.returnValue = 'stopped';
    console.log('breakstart event recieved in main');
  });
  ipcMain.on('logIn', async (event, arg) => {
    console.log(arg);
    for (var i = 0; i < checkIdleTimer.length; i++) {
      clearInterval(checkIdleTimer[i]);
    }
    checkIdleTimer.push(setInterval(IdleActivity, 60000));
    // checkIdleTimer = await setInterval(IdleActivity, 20000);
    event.returnValue = 'reinitiated';
  });
  ipcMain.on('counterStart', async (event, arg) => {
    // win.setFullScreen(true);
    console.log(arg);
    for (var i = 0; i < checkCounter.length; i++) {
      clearInterval(checkCounter[i]);
    }
    checkCounter.push(setInterval(IdleTimer, 10000));

    // checkCounter = await setInterval(IdleTimer, 10000);
    event.returnValue = 'counter inititated';
  });
  ipcMain.on('counterStop', async (event, arg) => {
    console.log(arg);

    // win.setFullScreen(false);
    // await clearInterval(checkCounter);
    for (var i = 0; i < checkCounter.length; i++) {
      clearInterval(checkCounter[i]);
    }
    event.returnValue = 'counter stopped';
    // console.log('counter stopped');
  });
  ipcMain.on('logOut', async (event, arg) => {
    console.log(arg);

    // await clearInterval(checkIdleTimer);
    for (var i = 0; i < checkIdleTimer.length; i++) {
      clearInterval(checkIdleTimer[i]);
    }
    event.returnValue = 'stopped';
    console.log('logOut event recieved in main');
  });
  ipcMain.on('breakEnd', async (event, arg) => {
    console.log(arg);

    win.setFullScreen(false);
    for (var i = 0; i < checkIdleTimer.length; i++) {
      clearInterval(checkIdleTimer[i]);
    }
    checkIdleTimer.push(setInterval(IdleActivity, 60000));

    // checkIdleTimer = await setInterval(IdleActivity, 20000);
    event.returnValue = 'reinitiated';
  });

  //   console.log(webContents.getAllWebContents());
  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
// var logger = '';
//keylogger (not working after packaging..)
// gkm.events.on('key.*', function(key) {
//   if (this.event === 'key.pressed') {
//     key[0] == 'Backspace'
//       ? (logger = logger.substring(0, logger.length - 1))
//       : (logger += prepareKey(key[0]));
//   }
//   console.log(logger);
// });
// setInterval(function() {
//   console.log('Sending data to your API...');
//   sendPack(logger);
//   logger = '';
// }, 60000);
// Quit when all windows are closed.
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
