import { contextBridge, ipcRenderer, safeStorage } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    loadChatHistory: (llmId: string) => ipcRenderer.invoke('load-chat-history', llmId),
    saveKey: (key: string, value: string) => ipcRenderer.invoke('save-key', key, value),
    retrieveKey: (key: string) => ipcRenderer.invoke('retrieve-key', key),
});

contextBridge.exposeInMainWorld('openAI', {
    sendMessage: (message: string) => ipcRenderer.invoke('send-message-openai', message),
});

contextBridge.exposeInMainWorld('google', {
    sendMessage: (message: string) => ipcRenderer.invoke('send-message-google', message),
});

