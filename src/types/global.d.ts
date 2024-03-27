// Definition: Define global types
declare global {
    interface Window {
        llmChatHistoriesLoaded: Record<string, { role: string; message: string; }[]>;
        llmId: string;
        llmName: string;
        electronAPI: {
            loadChatHistory: (llmId: string) => Promise<{ role: string, message: string }[]>;
            saveKey: (key: string, value: string) => Promise<boolean>;
            retrieveKey: (key: string) => Promise<string>;
            saveSettings: (jsonDocument: string) => Promise<boolean>; 
            loadSettings: () => Promise<string | null>; 
        };
        anthropic: {
            sendMessage: (message: string, model: string) => Promise<string>;
        };
        openAI: {
            sendMessage: (message: string, model: string) => Promise<string>;
        };
        google: {
            sendMessage: (message: string, model: string) => Promise<string>;
        };
    }
}

export { };
