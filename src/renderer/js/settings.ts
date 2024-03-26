document.getElementById('save-settings')!.addEventListener('click', async () => {
    const openaiKeyElement = <HTMLInputElement>document.getElementById('openai-api-key');
    const googleKeyElement = <HTMLInputElement>document.getElementById('google-gemini-api-key');


    const openaiKey = openaiKeyElement.value;
    const googleKey = googleKeyElement.value;

    try {
        const openAISavedSuccessfully = await window.electronAPI.saveKey('OPENAI_API_KEY', openaiKey);
        const googleGeminiSavedSuccessfully = await window.electronAPI.saveKey('GEMINI_API_KEY', googleKey);

        if (openAISavedSuccessfully && googleGeminiSavedSuccessfully) {
            alert('API keys saved successfully!');
        } else {
            alert('Failed to save API keys. Please try again.');
        }
    } catch (error) {
        console.error('Encryption failed', error);
        alert('Encryption failed. Please try again.');
    }

    window.location.href = 'index.html';
});

document.getElementById('cancel-settings')!.addEventListener('click', () => {
    window.location.href = 'index.html';
});
document.getElementById('cancel-settings')!.addEventListener('click', () => {
    window.location.href = 'index.html';
});

async function loadAPIKeys() {
    try {
        const openaiKey = await window.electronAPI.retrieveKey('OPENAI_API_KEY');
        const googleKey = await window.electronAPI.retrieveKey('GEMINI_API_KEY');

        const openaiKeyElement = document.getElementById('openai-api-key') as HTMLInputElement;
        const googleKeyElement = document.getElementById('google-gemini-api-key') as HTMLInputElement;

        if (openaiKeyElement && openaiKey !== null) {
            openaiKeyElement.value = openaiKey;
        }
        if (googleKeyElement && googleKey !== null) {
            googleKeyElement.value = googleKey;
        }
    } catch (error) {
        console.error('Error loading API keys:', error);
        alert('Failed to load API keys. Please try again.');
    }
}

loadAPIKeys();