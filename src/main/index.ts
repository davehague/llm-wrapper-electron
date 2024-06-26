import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { sendMessageAnthropic } from '../renderer/js/llm-models/anthropic';
import { sendMessageOpenAI } from '../renderer/js/llm-models/openai';
import { sendMessageGoogle } from '../renderer/js/llm-models/google';
import fs from 'fs/promises';
import { saveKeyToFile, retrievekeyFromFile } from '../renderer/js/utilities/keyManager';
import { saveSettingsToFile, loadSettingsFromFile } from '../renderer/js/utilities/settingsManager';

if (require('electron-squirrel-startup')) app.quit();

const userDataPath = app.getPath('userData');

function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true, // keep this true for security reasons
    }
  });

  // and load the index.html of the app.
  win.loadFile('./dist/index.html');

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

ipcMain.handle('save-key', async (event, keyName, keyValue) => {
  return saveKeyToFile(keyName, keyValue);
});

ipcMain.handle('retrieve-key', async (event, keyName) => {
  return retrievekeyFromFile(keyName);
});

ipcMain.handle('save-settings', async (event, jsonDocument) => {
  return saveSettingsToFile(jsonDocument);
});

ipcMain.handle('load-settings', async (event) => {
  return loadSettingsFromFile();
});

ipcMain.handle('send-message-anthropic', async (event, message, model) => {
  try {
    console.log("Received message in main process:", message);
    const response = await sendMessageAnthropic(userDataPath, message, model);
    return response;
  } catch (error) {
    console.error('Error handling sendMessage in main process:', error);
    return "Sorry, I couldn't send your message.";
  }
});

ipcMain.handle('send-message-openai', async (event, message, model) => {
  try {
    console.log("Received message in main process:", message);
    const response = await sendMessageOpenAI(userDataPath, message, model);
    return response;
  } catch (error) {
    console.error('Error handling sendMessage in main process:', error);
    return "Sorry, I couldn't send your message.";
  }
});

ipcMain.handle('send-message-google', async (event, message, model) => {
  try {
    console.log("Received message in main process:", message);
    const response = await sendMessageGoogle(userDataPath, message, model);
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
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
    if (!fileExists) {
      console.log('Chat history file does not exist:', filePath);
      return [];
    }

    const content = await fs.readFile(filePath, { encoding: 'utf8' });
    const messages = JSON.parse(content);
    return transformMessages(llmId, messages);
  } catch (error) {
    console.error('Failed to load chat history:', error);
    return [];
  }
});

function transformMessages(llmId: string, messages: any[]) {
  switch (true) {
    case llmId.startsWith('claude'):
    case llmId.startsWith('gpt'):
      return transformRoleContentMessages(messages);
    case llmId.startsWith('gemini'):
      return transformGeminiMessages(messages);
    default:
      console.error('Error transforming messages.  Not a recognized llmId:', llmId);
      return [];
  }
}


function transformRoleContentMessages(messages: any[]) {
  return messages.map((message) => {
    return {
      role: message.role,
      message: message.content,
    };
  });
}

function transformGeminiMessages(messages: any[]) {
  return messages.map((message) => {
    return {
      role: message.role,
      message: message.parts[0].text,
    };
  });
} 