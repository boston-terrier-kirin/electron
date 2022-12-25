const path = require('path');
const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    title: 'VideoInfo',
    width: 800,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.webContents.openDevTools();
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.on('close', () => {
    mainWindow = null;
  });
});

ipcMain.on('video:submit', (event, options) => {
  ffmpeg.ffprobe(options.path, function (err, metadata) {
    mainWindow.webContents.send('video:metadata', {
      duration: metadata.format.duration,
    });
  });
});
