// openai.js
require('dotenv').config();
const { OpenAI } = require('openai');
const { saveToFile } = require('../utilities/saveHistory');

const llmService = "openai";
const model = "gpt-3.5-turbo";

const maxTokens = 4096;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let conversationHistory = [
  { role: "system", content: "Keep your answers short, less than 1 paragraph. When giving advice, give no more than three options" }
];

async function sendMessage(userDataPath, text) {
  const userMessage = { role: "user", content: text };
  conversationHistory.push(userMessage);

  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: conversationHistory,
    });

    const llmResponse = { role: "assistant", content: completion.choices[0].message.content };

    saveToFile(userDataPath, llmService, model, [userMessage, llmResponse])
      .catch(error => console.error('Failed to save file:', error));

    pruneConversationHistoryToTokenLimit(maxTokens * 0.9);
    conversationHistory.push(llmResponse);

    console.log('Returning response:', llmResponse.content);
    return llmResponse.content;
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    return "Sorry, I can't process your message right now.";
  }
}

function approximateTokenCount(text) {
  const avgCharsPerToken = 4; // An approximation of average characters per token
  return Math.ceil(text.length / avgCharsPerToken);
}

function pruneConversationHistoryToTokenLimit(maxTokens) {
  let totalTokens = 0;

  // Count tokens from the end of the conversationHistory array until maxTokens limit is reached
  let index = conversationHistory.length;
  while (index-- > 0 && totalTokens <= maxTokens) {
    const messageText = conversationHistory[index].content;
    totalTokens += approximateTokenCount(messageText);
  }

  if (totalTokens > maxTokens) {
    // Keep the most recent part of the conversation that fits into maxTokens
    conversationHistory = conversationHistory.slice(index + 2);
  }
}

module.exports = { sendMessage };
