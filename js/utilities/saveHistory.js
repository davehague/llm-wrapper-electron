const fs = require('fs').promises;
const path = require('path');

async function saveToFile(userDataPath, llmService, modelName, messages) {
    try {
        const chatLogsPath = path.join(userDataPath, 'chat_logs');
        const fileName = `${llmService}-${modelName}.json`;
        const filePath = path.join(chatLogsPath, fileName);
        console.log('Saving chat history to:', filePath);
        
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

        if (!fileExists) {
            await fs.writeFile(filePath, JSON.stringify(messages, null, 2), { encoding: 'utf8' });
        } else {
            const existingContent = await fs.readFile(filePath, { encoding: 'utf8' });
            const messagesArray = JSON.parse(existingContent);
            messages.forEach(message => messagesArray.push(message));
            await fs.writeFile(filePath, JSON.stringify(messagesArray, null, 2), { encoding: 'utf8' });
        }

    } catch (error) {
        console.error('Error appending message:', error);
    }
}

module.exports = { saveToFile };
