// renderer.js
document.addEventListener("DOMContentLoaded", () => {
    console.log('DOM loaded at:', new Date().toLocaleString());
    console.trace("DOMContentLoaded triggered");
    const llmItems = document.querySelectorAll('.llm-item');
    const chatMessages = document.getElementById('chat-messages');

    function clearChatWindow() {
        console.log('Clearing chat window');
        chatMessages.innerHTML = '';
    }

    function handleLLMItemClick(item) {
        console.log('LLM item clicked at:', new Date().toLocaleString());
        const isSelected = item.classList.contains('llm-item-selected');
        llmItems.forEach(i => i.classList.remove('llm-item-selected'));
        if (!isSelected) {
            item.classList.add('llm-item-selected');
            clearChatWindow();
            onLLMItemSelected();
        }
    }

    llmItems.forEach(item => {
        item.addEventListener('click', () => handleLLMItemClick(item));
    });

    if (llmItems.length > 0) {
        handleLLMItemClick(llmItems[0]);
    }
});


function onLLMItemSelected() {
    console.log('LLM item selected at:', new Date().toLocaleString());
}


document.getElementById('message-input').addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        const message = event.target.value.trim();
        if (message) {
            addMessageToChat('User', message);
            event.target.value = '';

            const response = await window.electronAPI.sendMessage(message);
            addMessageToChat('OpenAI', response);
        }
    }
});


function addMessageToChat(sender, message) {
    try {
        const chatMessages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
    
        if (sender === 'User') {
            messageDiv.classList.add('user-message');
            messageDiv.innerText = message;
        } else {
            messageDiv.classList.add('llm-message');
            messageDiv.innerHTML = marked.parse(message);
        }
    
        chatMessages.appendChild(messageDiv);
    
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    catch (error) {
        console.error('Error adding message to chat:', error);
    }
}
