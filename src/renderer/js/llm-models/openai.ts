// openai.js
import dotenv from 'dotenv';
dotenv.config();
import { OpenAI } from 'openai'; // Assuming 'openai' package is ES6 module compatible
import { saveToFile } from '../utilities/saveHistory';
import { OpenAIMessage } from '@/types/llmWrapperTypes';
import { retrievekeyFromFile } from '../utilities/keyManager';
import { hasYouTubeUrl, getTranscript } from '../utilities/youtube';
import { loadSettingsFromFile } from '../utilities/settingsManager';


const llmService = "openai";

const maxTokens = 4096;
let openAI: OpenAI;
let isInitialized = false;
let systemPrompt = 'You are a helpful chatbot';
let conversationHistory: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

async function initializeOpenAI() {
  const openaiKey = await retrievekeyFromFile('OPENAI_API_KEY');
  openAI = new OpenAI({ apiKey: openaiKey });
  const settingsDocument = await loadSettingsFromFile();
  systemPrompt = JSON.parse(settingsDocument).systemPrompt;
  console.log('OpenAI initialized with system prompt:', systemPrompt);
  conversationHistory.push({ role: "system", content: systemPrompt });
}

export async function sendMessageOpenAI(userDataPath: string, text: string, model: string): Promise<string> {
  try {
    if (!isInitialized) {
      await initializeOpenAI();
      isInitialized = true;
    }

    let userMessage: OpenAIMessage;
    if (model.includes('3.5') && hasYouTubeUrl(text)) {
      const transcript = await getTranscript(text);
      const fullTranscript = transcript.map((entry: any) => entry.text).join(' ');
      //console.log('YouTube transcript:', fullTranscript);

      userMessage = { role: "user", content: [text, fullTranscript].join('\n\n Transcript is below:\n\n') };
      conversationHistory.push(userMessage);
    }
    else {
      userMessage = { role: "user", content: text };
      conversationHistory.push(userMessage);
    }

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


