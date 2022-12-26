import path from 'path';
import { BrowserWindow, Menu, app, ipcMain } from 'electron';

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

let mainWindow;

function createMainWidnow() {
  mainWindow = new BrowserWindow({
    width: isDev ? 1400 : 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: path.resolve(__dirname, 'preload.js'),
    },
  });

  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadFile('dist/index.html');
}

app.whenReady().then(() => {
  createMainWidnow();

  const mainMenu = Menu.buildFromTemplate([]);
  Menu.setApplicationMenu(mainMenu);

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

ipcMain.on('ping', (event, options) => {
  console.log(options);
});
