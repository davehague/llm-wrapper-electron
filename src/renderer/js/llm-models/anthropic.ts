// openai.js
import dotenv from 'dotenv';
dotenv.config();
import Anthropic from '@anthropic-ai/sdk';

import { saveToFile } from '../utilities/saveHistory';
import { retrievekeyFromFile } from '../utilities/keyManager';
import { hasYouTubeUrl, getTranscript } from '../utilities/youtube';
import { loadSettingsFromFile } from '../utilities/settingsManager';

const maxTokens = 4096;
let anthropic: Anthropic;

let isInitialized = false;
let systemPrompt = 'You are a helpful chatbot';
let conversationHistory: { role: string, content: string }[] = [];

async function initialize() {
  const key = await retrievekeyFromFile('ANTHROPIC_API_KEY');
  console.log('Initializing Anthropic with key:', key);
  anthropic = new Anthropic({
    apiKey: key,
  });

  const settingsDocument = await loadSettingsFromFile();
  systemPrompt = JSON.parse(settingsDocument).systemPrompt;
  console.log('Anthropic was initialized with system prompt:', systemPrompt);

  isInitialized = true;
}

export async function sendMessageAnthropic(userDataPath: string, text: string, model: string): Promise<string> {
  try {
    if (!isInitialized) {
      await initialize();
    }

    let userMessage: { role: string, content: string };
    if (model.includes('haiku') && hasYouTubeUrl(text)) {
      const transcript = await getTranscript(text);
      const fullTranscript = transcript.map((entry: any) => entry.text).join(' ');
      userMessage = { role: "user", content: [text, fullTranscript].join('\n\n Transcript is below:\n\n') };
      conversationHistory.push(userMessage);
    }
    else {
      userMessage = { role: "user", content: text };
      conversationHistory.push(userMessage);
    }

    const response = await anthropic.messages.create({
      model: model,
      max_tokens: 1024,
      messages: conversationHistory.map(message => ({ role: message.role as "user" | "assistant", content: message.content }))
    });

    console.log(response);
    const llmResponse = { role: "assistant", content: response.content[0].text ?? "" };
    conversationHistory.push(llmResponse);

    saveToFile(userDataPath, model, [userMessage, llmResponse])
      .catch((error: any) => console.error('Failed to save file:', error));

    //pruneConversationHistoryToTokenLimit(maxTokens * 0.9);
    console.log('Returning response:', llmResponse.content);
    return llmResponse.content;
  } catch (error) {
    console.error('Error communicating with Anthropic:', error);
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


