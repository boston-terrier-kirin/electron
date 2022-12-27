import path from 'path';
import { BrowserWindow, Menu, app, ipcMain } from 'electron';
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('./config/db');
const Log = require('./models/log');

connectDB();

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

  const mainMenu = Menu.buildFromTemplate(menu);
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

const menu = [
  ...(isMac ? [{ role: 'appMenu' }] : []),
  {
    role: 'fileMenu',
  },
  {
    role: 'editMenu',
  },
  {
    label: 'Logs',
    submenu: [
      {
        label: 'Clear Logs',
        click: () => clearLogs(),
      },
    ],
  },
  ...(isDev
    ? [
        {
          label: 'Developer',
          submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'toggledevtools' },
          ],
        },
      ]
    : []),
];

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

ipcMain.on('logs:load', sendLogs);

ipcMain.on('logs:add', async (event, item) => {
  try {
    await Log.create(item);
    await sendLogs();
  } catch (err) {
    console.log(err);
  }
});

ipcMain.on('logs:remove', async (event, id) => {
  try {
    await Log.findByIdAndDelete({ _id: id });
    await sendLogs();
  } catch (err) {
    console.log(err);
  }
});

async function sendLogs() {
  try {
    const logs = await Log.find().sort({ created: -1 });

    mainWindow.webContents.send('logs:get', {
      logs: JSON.stringify(logs),
    });
  } catch (err) {
    console.log(err);
  }
}

async function clearLogs() {
  try {
    await Log.deleteMany({});
    mainWindow.webContents.send('logs:clear');
  } catch (err) {
    console.log(err);
  }
}
