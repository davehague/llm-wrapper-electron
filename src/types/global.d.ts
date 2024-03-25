// Definition: Define global types
declare global {
    interface Window {
        llmChatHistoriesLoaded: Record<string, boolean>;
        llmId: string;
        llmName: string;
        electronAPI: {
            loadChatHistory: (llmId: string) => Promise<string>;
        };
        google: {
            sendMessage: (message: string) => Promise<string>;
        };
        openAI: {
            sendMessage: (message: string) => Promise<string>;
        };
    }
}

export {};
