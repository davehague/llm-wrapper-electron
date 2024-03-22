const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { sendMessageOpenAI } = require('./llm-models/openai');
const { sendMessageGoogle } = require('./llm-models/google');
const fs = require('fs').promises;
const userDataPath = app.getPath('userData');

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

ipcMain.handle('send-message-openai', async (event, message) => {
  try {
    console.log("Received message in main process:", message);
    const response = await sendMessageOpenAI(userDataPath, message);
    return response;
  } catch (error) {
    console.error('Error handling sendMessage in main process:', error);
    return "Sorry, I couldn't send your message.";
  }
});

ipcMain.handle('send-message-google', async (event, message) => {
  try {
    console.log("Received message in main process:", message);
    const response = await sendMessageGoogle(userDataPath, message);
    return response;
  } catch (error) {
    console.error('Error handling sendMessage in main process:', error);
    return "Sorry, I couldn't send your message.";
  }
});

ipcMain.handle('load-chat-history', async (event, llmId) => {
  const chatLogsPath = path.join(userDataPath, 'chat_logs');
  const fileName = `${llmId}.json`;
  const filePath = path.join(chatLogsPath, fileName);

  try {
    const content = await fs.readFile(filePath, { encoding: 'utf8' });
    return content;
  } catch (error) {
    console.error('Failed to load chat history:', error);
    return "";
  }
});