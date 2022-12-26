import path from 'path';
import { BrowserWindow, app, ipcMain } from 'electron';

app.whenReady().then(() => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: path.resolve(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('dist/index.html');
  mainWindow.webContents.openDevTools({ mode: 'detach' });
});

app.once('window-all-closed', () => app.quit());

ipcMain.on('ping', (event, options) => {
  console.log(options);
});
