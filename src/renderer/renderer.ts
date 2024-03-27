// renderer.js

// From global.d.ts
window.llmChatHistoriesLoaded = {};
window.llmId = '';
window.llmName = '';

document.getElementById('settings-button')!.addEventListener('click', () => {
    window.location.href = 'settings.html';
});

document.addEventListener("DOMContentLoaded", () => {
    console.log('DOM loaded at:', new Date().toLocaleString());
    console.trace("DOMContentLoaded triggered");
    const llmItems = document.querySelectorAll('.llm-item');
    const chatMessages = document.getElementById('chat-messages');

    // Load and store chat histories for all LLMs
    llmItems.forEach(item => {
        const llmId = item.id;
        loadAndStoreChatHistory(llmId);
    });

    function clearChatWindow() {
        console.log('Clearing chat window');
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }
    }

    async function handleLLMItemClick(item: Element) {
        console.log('LLM item clicked at:', new Date().toLocaleString());
        const isSelected = item.classList.contains('llm-item-selected');
        const llmItems = document.querySelectorAll('.llm-item');
        llmItems.forEach(i => i.classList.remove('llm-item-selected'));
        if (!isSelected) {
            item.classList.add('llm-item-selected');
            clearChatWindow();
            await loadAndStoreChatHistory(item.id, true);

            window.llmName = item.getAttribute('llmname') ?? '';
            window.llmId = item.id;

            await onLLMItemSelected(item.id);
        }
    }

    llmItems.forEach(item => {
        item.addEventListener('click', () => handleLLMItemClick(item));
    });

    if (llmItems.length > 0) {
        handleLLMItemClick(llmItems[0]);
    }
});

async function loadAndStoreChatHistory(llmId: string, reload = false) {
    if (reload || !window.llmChatHistoriesLoaded[llmId]) {
        try {
            const chatHistory = await window.electronAPI.loadChatHistory(llmId);
            if (chatHistory) {
                window.llmChatHistoriesLoaded[llmId] = chatHistory;
            }
        } catch (error) {
            console.error('Error loading chat history for', llmId, ':', error);
        }
    }
}

async function onLLMItemSelected(llmId: string) {
    console.log('LLM item selected at:', new Date().toLocaleString(), 'ID:', llmId);

    try {
        await loadAndStoreChatHistory(llmId);
        displayChatHistory(window.llmChatHistoriesLoaded[llmId]);
    } catch (error) {
        console.error('Error loading chat history for', llmId, ':', error);
    }
}


function displayChatHistory(chatHistory: { role: string; message: string; }[]) {
    // Assuming chatHistory is now an array of message objects
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        chatMessages.innerHTML = '';

        if (Array.isArray(chatHistory)) {
            chatHistory.forEach((message: { role: string; message: string; }) => {
                const sender = message.role === 'user' ? 'User' : window.llmName;
                addMessageToChat(sender, message.message);
            });
        }

        //  Ensure the scroll happens after the content has been fully rendered
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            });
        });
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
            if (window.llmId.startsWith('gemini')) {
                response = await window.google.sendMessage(message, window.llmId);
            }
            else if (window.llmId.startsWith('gpt')) {
                response = await window.openAI.sendMessage(message, window.llmId);
            }
            else if (window.llmId.startsWith('claude')) {
                response = await window.anthropic.sendMessage(message, window.llmId);
            }
            else {
                response = `Not a recognized llmId: ${window.llmId}`;
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
            messageDiv.classList.add(sender === 'User' ? 'user-message' : 'llm-message');
            messageDiv.innerHTML = await marked.parse(message);

            chatMessages.appendChild(messageDiv);

            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
    catch (error) {
        console.error('Error adding message to chat:', error);
    }
}
