const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { sendMessage } = require('./llm-models/openai');

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // keep this true for security reasons
    }
  });

  // and load the index.html of the app.
  win.loadFile('html/index.html');

  // Open the DevTools.
  win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('sendMessage', async (event, message) => {
  try {
    console.log("Received message in main process:", message);
    const response = await sendMessage(message);
    return response;
  } catch (error) {
    console.error('Error handling sendMessage in main process:', error);
    return "Sorry, I couldn't send your message.";
  }
});
