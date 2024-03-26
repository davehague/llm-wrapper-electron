import fs from 'fs/promises';
import path from 'path';
import { app } from 'electron';

async function saveSettingsToFile(settings: string): Promise<boolean> {
    const userDataPath = app.getPath('userData');
    const settingsPath = path.join(userDataPath, 'settings.json');
    try {
        await fs.writeFile(settingsPath, settings, { encoding: 'utf8' });
        return true;
    } catch (error) {
        console.error('Error saving settings:', error);
        return false;
    }
}

async function loadSettingsFromFile(): Promise<string> {
    const userDataPath = app.getPath('userData');
    const settingsPath = path.join(userDataPath, 'settings.json');
    try {
        const fileExists = await fs.access(settingsPath).then(() => true).catch(() => false);
        if (!fileExists) {
            console.log('Settings file does not exist:', settingsPath);
            return '{}';
        }

        const content = await fs.readFile(settingsPath, { encoding: 'utf8' });
        return content;
    } catch (error) {
        console.error('Failed to load settings:', error);
        return '{}';
    }
}

export { saveSettingsToFile, loadSettingsFromFile };