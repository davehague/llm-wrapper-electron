// renderer.js
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
    console.log(`${sender}: ${message}`);
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
