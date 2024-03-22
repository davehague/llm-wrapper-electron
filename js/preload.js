const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    'electronAPI', {
    loadChatHistory: (llmId) => ipcRenderer.invoke('load-chat-history', llmId),
}
);

contextBridge.exposeInMainWorld(
    'openAI', {
    sendMessage: (message) => ipcRenderer.invoke('send-message-openai', message),
}
);

contextBridge.exposeInMainWorld(
    'google', {
    sendMessage: (message) => ipcRenderer.invoke('send-message-google', message),
}
);
