const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    'electronAPI', {
    sendMessage: (message) => ipcRenderer.invoke('sendMessage', message),
    receiveMessage: (callback) => ipcRenderer.on('fromMain', callback),
    loadChatHistory: (llmId) => ipcRenderer.invoke('load-chat-history', llmId),
}
);
