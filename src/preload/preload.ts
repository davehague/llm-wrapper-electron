import { contextBridge, ipcRenderer, safeStorage } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    loadChatHistory: (llmId: string) => ipcRenderer.invoke('load-chat-history', llmId),
    saveKey: (key: string, value: string) => ipcRenderer.invoke('save-key', key, value),
    retrieveKey: (key: string) => ipcRenderer.invoke('retrieve-key', key),
});

contextBridge.exposeInMainWorld('openAI', {
    sendMessage: (message: string, model: string) => ipcRenderer.invoke('send-message-openai', message, model),
});

contextBridge.exposeInMainWorld('google', {
    sendMessage: (message: string, model: string) => ipcRenderer.invoke('send-message-google', message, model),
});

