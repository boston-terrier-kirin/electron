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
      // contextが共有されて、nodeが有効になっている場合のみ、html側で、requireが使えるようになる。
      // contextIsolation: false / nodeIntegration: true の場合、html側で、requireが使える。
      // contextIsolation: false / nodeIntegration: false の場合、html側で、requireが使えない。
      // contextIsolation: true / nodeIntegration: true の場合、html側で、requireが使えない。
      contextIsolation: true,
      nodeIntegration: false,
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
    console.log('metadata.format.duration', metadata.format.duration);

    mainWindow.webContents.send('video:metadata', {
      duration: metadata.format.duration,
    });
  });
});
