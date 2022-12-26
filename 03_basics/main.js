const path = require('path');
const { app, BrowserWindow } = require('electron');

process.env.NODE_ENV = 'development';

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

let mainWindow;

function createMainWidnow() {
  mainWindow = new BrowserWindow({
    title: 'Basics',
    width: isDev ? 1000 : 500,
    height: 800,
    minHeight: 600,
    // titleBarStyle: 'hidden',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.on('focus', () => {
    console.log('Focus');
  });

  mainWindow.on('blur', () => {
    console.log('Blur');
  });

  let wc = mainWindow.webContents;
  wc.on('did-finish-load', () => {
    console.log('Content Loaded');
  });

  const childWindow = new BrowserWindow({
    title: 'Child',
    width: 400,
    height: 400,
    parent: mainWindow,
    modal: true,
    frame: false,
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
  childWindow.loadFile(path.join(__dirname, './renderer/child.html'));

  BrowserWindow.getAllWindows().forEach((window) => console.log(window.title));

  setTimeout(() => {
    childWindow.hide();
  }, 5000);
}

app.whenReady().then(() => {
  createMainWidnow();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWidnow();
    }
  });
});

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});
