// openai.js
import dotenv from 'dotenv';
dotenv.config();
import { OpenAI } from 'openai'; // Assuming 'openai' package is ES6 module compatible
import { saveToFile } from '../utilities/saveHistory';
import { OpenAIMessage } from '@/types/llmWrapperTypes';
import { retrievekeyFromFile } from '../utilities/keyManager';

const llmService = "openai";

const maxTokens = 4096;
let openAI: OpenAI;
let isInitialized = false;

async function initializeOpenAI() {
  const openaiKey = await retrievekeyFromFile('OPENAI_API_KEY');
  openAI = new OpenAI({ apiKey: openaiKey });
}

let conversationHistory: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  // { role: "system", content: "Keep your answers short, less than 1 paragraph. When giving advice, give no more than three options" },
  { role: "system", content: "You are a helpful chatbot." },
];

export async function sendMessageOpenAI(userDataPath: string, text: string, model: string): Promise<string> {
  try {
    if(!isInitialized) {
      await initializeOpenAI();
      isInitialized = true;
    }

    const userMessage: OpenAIMessage = { role: "user", content: text };
    conversationHistory.push(userMessage);

    const completion = await openAI.chat.completions.create({
      model: model,
      messages: conversationHistory
    });

    const llmResponse: OpenAIMessage = { role: "assistant", content: completion.choices[0].message.content ?? "" };

    saveToFile(userDataPath, model, [userMessage, llmResponse])
      .catch((error: any) => console.error('Failed to save file:', error));

    pruneConversationHistoryToTokenLimit(maxTokens * 0.9);
    conversationHistory.push(llmResponse);

    console.log('Returning response:', llmResponse.content);
    return llmResponse.content;
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    return "Sorry, I can't process your message right now.";
  }
}

function approximateTokenCount(text: string): number {
  const avgCharsPerToken = 4; // An approximation of average characters per token
  return Math.ceil(text.length / avgCharsPerToken);
}

function pruneConversationHistoryToTokenLimit(maxTokens: number): void {

  let totalTokens = 0;

  // Count tokens from the end of the conversationHistory array until maxTokens limit is reached
  let index = conversationHistory.length;
  while (index-- > 0 && totalTokens <= maxTokens) {
    const messageText = conversationHistory[index].content;

    totalTokens += approximateTokenCount(messageText as string);
  }

  if (totalTokens > maxTokens) {
    // Keep the most recent part of the conversation that fits into maxTokens
    conversationHistory = conversationHistory.slice(index + 2);
  }
}


