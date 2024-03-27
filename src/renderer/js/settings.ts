let systemSettingsJson: any = {};

document.getElementById('save-settings')!.addEventListener('click', async () => {
    const openaiKeyElement = <HTMLInputElement>document.getElementById('openai-api-key');
    const googleKeyElement = <HTMLInputElement>document.getElementById('google-gemini-api-key');
    const anthropicKeyElement = <HTMLInputElement>document.getElementById('anthropic-api-key');
    const systemPromptElement = <HTMLTextAreaElement>document.getElementById('system-prompt-text');

    const openaiKey = openaiKeyElement.value;
    const googleKey = googleKeyElement.value;
    const anthropicKey = anthropicKeyElement.value;
    const systemPrompt = systemPromptElement.value;
    console.log('System prompt:', systemPrompt);
    try {
        if(!systemSettingsJson) {
            loadSettings();
        }
        systemSettingsJson.systemPrompt = systemPrompt;
        await window.electronAPI.saveSettings(JSON.stringify(systemSettingsJson));

        const openAISavedSuccessfully = await window.electronAPI.saveKey('OPENAI_API_KEY', openaiKey);
        const googleGeminiSavedSuccessfully = await window.electronAPI.saveKey('GEMINI_API_KEY', googleKey);
        const anthropicSavedSuccessfully = await window.electronAPI.saveKey('ANTHROPIC_API_KEY', anthropicKey);

        if (openAISavedSuccessfully && googleGeminiSavedSuccessfully && anthropicSavedSuccessfully) {
            console.log('API keys saved successfully!');
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
        const anthropicKey = await window.electronAPI.retrieveKey('ANTHROPIC_API_KEY');
        const openaiKey = await window.electronAPI.retrieveKey('OPENAI_API_KEY');
        const googleKey = await window.electronAPI.retrieveKey('GEMINI_API_KEY');

        const anthropicKeyElement = document.getElementById('anthropic-api-key') as HTMLInputElement;
        const openaiKeyElement = document.getElementById('openai-api-key') as HTMLInputElement;
        const googleKeyElement = document.getElementById('google-gemini-api-key') as HTMLInputElement;

        if (anthropicKeyElement && anthropicKey !== null) {
            anthropicKeyElement.value = anthropicKey;
        }
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

async function loadSettings() {
    try {
        const systemPrompt = document.getElementById('system-prompt-text') as HTMLInputElement;

        const settings = await window.electronAPI.loadSettings();
        if (settings) {
            systemSettingsJson = settings ? JSON.parse(settings) : {};
            systemPrompt.value = systemSettingsJson.systemPrompt;
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        alert('Failed to load settings. Please try again.');
    }
}

loadAPIKeys();
loadSettings();