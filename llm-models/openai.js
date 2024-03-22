// openai.js
require('dotenv').config();
const { OpenAI } = require('openai');

const model = "gpt-3.5-turbo";
const maxTokens = 4096;
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

let conversationHistory = [
    { role: "system", content: "Keep your answers short, less than 1 paragraph. When giving advice, give no more than three options" }
];

async function sendMessage(text) {
    // Append the user's message to the conversation history
    conversationHistory.push({ role: "user", content: text });

    try {
        const completion = await openai.chat.completions.create({
            model: model,
            messages: conversationHistory,
        });

        // Append the LLM's response to the conversation history
        const llmResponse = completion.choices[0].message.content;
        pruneConversationHistoryToTokenLimit(maxTokens * 0.9);
        conversationHistory.push({ role: "assistant", content: llmResponse });

        return llmResponse;
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
