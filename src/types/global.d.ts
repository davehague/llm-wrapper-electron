// Definition: Define global types
declare global {
    interface Window {
        llmChatHistoriesLoaded: Record<string, { role: string; message: string; }[]>;
        llmId: string;
        llmName: string;
        electronAPI: {
            loadChatHistory: (llmId: string) => Promise<{ role: string, message: string }[]>;
        };
        google: {
            sendMessage: (message: string) => Promise<string>;
        };
        openAI: {
            sendMessage: (message: string) => Promise<string>;
        };
    }
}

export { };
