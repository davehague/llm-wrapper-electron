import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { saveToFile } from '../utilities/saveHistory';
import { GeminiMessageHistory } from '@/types/llmWrapperTypes';


const llmService = "google";
const modelName = "gemini-pro";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

let history: any[] = [];

async function sendMessageGoogle(userDataPath: string, originalMessage: string): Promise<string> {
    // Return some dummy value for now
    return "This is a dummy response from Google Gemini";

    // const userMessage = { role: "user", parts: [{ text: originalMessage }] };

    // try {
    //     const safetySettings = [
    //         {
    //             category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    //             threshold: HarmBlockThreshold.BLOCK_NONE,
    //         },
    //         {
    //             category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    //             threshold: HarmBlockThreshold.BLOCK_NONE,
    //         },
    //         {
    //             category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    //             threshold: HarmBlockThreshold.BLOCK_NONE,
    //         },
    //         {
    //             category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    //             threshold: HarmBlockThreshold.BLOCK_NONE,
    //         },
    //         {
    //             category: HarmCategory.HARM_CATEGORY_UNSPECIFIED,
    //             threshold: HarmBlockThreshold.BLOCK_NONE,
    //         },
    //     ];

    //     const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro", safetySettings });

    //     const chat = model.startChat({
    //         history: history,
    //         generationConfig: {
    //             maxOutputTokens: 1000,
    //         },
    //     });

    //     const result = await chat.sendMessage(draftMessage);
    //     const response = await result.response;
    //     const text = response.text();

    //     let history = await chat.getHistory();
    //     return {
    //         success: true,
    //         message: 'Message generated successfully',
    //         data: text,
    //         history: history,
    //     };
    // } catch (error) {
    //     console.error((error as any).response?.promptFeedback);
    //     console.error('Failed to generate message with error:', error instanceof Error ? error.message : error);
    //     return {
    //         success: false,
    //         message: 'Failed to generate message',
    //         error: error instanceof Error ? error.message : 'Unknown error',
    //     };
    // }
}

function pruneConversationHistoryToTokenLimit(maxTokens: number): void {
    // Implement token counting and pruning logic if necessary
}

export { sendMessageGoogle };
