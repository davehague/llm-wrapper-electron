export interface OpenAIMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

export interface GeminiMessageHistory {
    role: "user" | "model" | "function" | "assistant"; 
    parts: { text: string }[];
}