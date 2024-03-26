import dotenv from 'dotenv';
dotenv.config();
import { Content, GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { saveToFile } from '../utilities/saveHistory';
import { GeminiMessageHistory } from '@/types/llmWrapperTypes';


const llmService = "google";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
let chatHistory: Content[] = [];

async function sendMessageGoogle(userDataPath: string, originalMessage: string, modelName: string): Promise<string> {
    const userMessage = { role: "user", parts: [{ text: originalMessage }] };

    try {
        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_UNSPECIFIED,
                threshold: HarmBlockThreshold.BLOCK_NONE,
            },
        ];

        const model = genAI.getGenerativeModel({ model: modelName, safetySettings });

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(originalMessage);
        const response = await result.response;
        const text = response.text();

        saveToFile(userDataPath, modelName, [userMessage, response.candidates && response.candidates[0]?.content])
            .catch((error: any) => console.error('Failed to save file:', error));

        chatHistory = await chat.getHistory();
        return text;
    } catch (error) {
        console.error((error as any).response?.promptFeedback);
        console.error('Failed to generate message with error:', error instanceof Error ? error.message : error);
        return 'Failed to generate message';
    }
}

function pruneConversationHistoryToTokenLimit(maxTokens: number): void {
    // Implement token counting and pruning logic if necessary
}

export { sendMessageGoogle };
