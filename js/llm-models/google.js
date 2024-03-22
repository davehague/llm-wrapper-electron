require('dotenv').config();
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
const { saveToFile } = require('../utilities/saveHistory');

const llmService = "google";
const modelName = "gemini-pro";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

let conversationHistory = [];

async function sendMessageGoogle(userDataPath, originalMessage) {
    const userMessage = { role: "user", parts: [{ text: originalMessage }] };
    //    conversationHistory.push(userMessage);

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

        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro", safetySettings });

        console.log('Conversation history:', conversationHistory);
        const chat = model.startChat({
            history: conversationHistory,
            generationConfig: {
                maxOutputTokens: 1000,
            },
        });

        const result = await chat.sendMessage(originalMessage);
        const response = await result.response;
        const llmResponse = response.text();

        conversationHistory = await chat.getHistory();
        saveToFile(userDataPath, llmService, modelName, conversationHistory)
            .catch(error => console.error('Failed to save file:', error));

        console.log('Updated conversation history:', conversationHistory);
        return llmResponse;

    } catch (error) {
        console.error((error).response?.promptFeedback);
        console.error('Failed to generate message with error:', error instanceof Error ? error.message : error);
        return {
            success: false,
            message: 'Failed to generate message',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

function pruneConversationHistoryToTokenLimit(maxTokens) {
    // Implement token counting and pruning logic if necessary
}

module.exports = { sendMessageGoogle };
