// renderer.js

// From global.d.ts
window.llmChatHistoriesLoaded = {};
window.llmId = '';
window.llmName = '';

document.addEventListener("DOMContentLoaded", () => {
    console.log('DOM loaded at:', new Date().toLocaleString());
    console.trace("DOMContentLoaded triggered");
    const llmItems = document.querySelectorAll('.llm-item');
    const chatMessages = document.getElementById('chat-messages');

    function clearChatWindow() {
        console.log('Clearing chat window');
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }
    }

    function handleLLMItemClick(item: Element) {
        console.log('LLM item clicked at:', new Date().toLocaleString());
        const isSelected = item.classList.contains('llm-item-selected');
        llmItems.forEach(i => i.classList.remove('llm-item-selected'));
        if (!isSelected) {
            item.classList.add('llm-item-selected');
            clearChatWindow();

            window.llmName = item.getAttribute('llmname') ?? '';
            window.llmId = item.id;

            onLLMItemSelected(item.id);
        }
    }

    llmItems.forEach(item => {
        item.addEventListener('click', () => handleLLMItemClick(item));
    });

    if (llmItems.length > 0) {
        handleLLMItemClick(llmItems[0]);
    }
});


async function onLLMItemSelected(llmId: string) {
    console.log('LLM item selected at:', new Date().toLocaleString(), 'ID:', llmId);

    // Check if the chat for this LLM has already been loaded
    if (!window.llmChatHistoriesLoaded[llmId]) {
        try {
            const chatHistory = await window.electronAPI.loadChatHistory(llmId);
            if (chatHistory) {
                displayChatHistory(chatHistory);
                window.llmChatHistoriesLoaded[llmId] = true;
            }
        } catch (error) {
            console.error('Error loading chat history for', llmId, ':', error);
        }
    }
}


function displayChatHistory(chatHistory: string) {
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        chatMessages.innerHTML = '';


        const history = JSON.parse(chatHistory);
        history.forEach((message: { role: string; content: any; }) => {
            const sender = message.role === 'user' ? 'User' : window.llmName;
            addMessageToChat(sender, message.content);
        });

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}


document.getElementById('message-input')?.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();

        const inputElement = event.target as HTMLInputElement;
        const message = inputElement.value.trim();
        
        if (message) {
            addMessageToChat('User', message);
            inputElement.value = ''; 

            let response: string;
            switch (window.llmId) { 
                case 'google-gemini-1.0-pro':
                    response = await window.google.sendMessage(message);
                    break;
                case 'openai-gpt-3.5-turbo':
                    response = await window.openAI.sendMessage(message);
                    break;
                default:
                    response = `Unknown LLM selected: ${window.llmName}`;
                    break;
            }

            addMessageToChat(window.llmName, response);
        }
    }
});

declare var marked: {
    parse: (markdown: string) => Promise<string>;
};

async function addMessageToChat(sender: string, message: string) {
    try {
        const chatMessages = document.getElementById('chat-messages');

        if (chatMessages) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');

            if (sender === 'User') {
                messageDiv.classList.add('user-message');
                messageDiv.innerText = message;
            } else {
                messageDiv.classList.add('llm-message');
                messageDiv.innerHTML = await marked.parse(message);
            }

            chatMessages.appendChild(messageDiv);

            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    catch (error) {
        console.error('Error adding message to chat:', error);
    }
}
