import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    loadChatHistory: (llmId: string) => ipcRenderer.invoke('load-chat-history', llmId),
});

contextBridge.exposeInMainWorld('openAI', {
    sendMessage: (message: string) => ipcRenderer.invoke('send-message-openai', message),
});

contextBridge.exposeInMainWorld('google', {
    sendMessage: (message: string) => ipcRenderer.invoke('send-message-google', message),
});
