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
