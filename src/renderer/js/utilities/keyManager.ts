import fs from 'fs/promises';
import path from 'path';
import { app, safeStorage } from 'electron';

async function saveKeyToFile(keyName: string, keyValue: string): Promise<boolean> {
    try {
        if (safeStorage.isEncryptionAvailable()) {
            const userDataPath = app.getPath('userData');
            const encryptedString = safeStorage.encryptString(keyValue).toString('hex');
            const filePath = path.join(userDataPath, `${keyName}.txt`);
            await fs.writeFile(filePath, encryptedString, { encoding: 'utf8' });
            return true;
        } else {
            console.error('Encryption not available.');
            return false;
        }
    } catch (error) {
        console.error('Failed to save the key:', error);
        return false;
    }
}

async function retrievekeyFromFile(keyName: string): Promise<string> {
    try {
        const userDataPath = app.getPath('userData');
        const filePath = path.join(userDataPath, `${keyName}.txt`);
        console.log('Retrieving key from:', filePath);

        const fileExists = await fs.access(filePath).then(() => true).catch(() => false);

        if (fileExists) {
            const encryptedString = await fs.readFile(filePath, 'utf-8');
            if (safeStorage.isEncryptionAvailable()) {
                const decryptedString = safeStorage.decryptString(Buffer.from(encryptedString, 'hex'));
                return decryptedString;
            } else {
                console.error('Decryption not available.');
                return '';
            }
        } else {
            console.error('Key file does not exist.');
            return '';
        }
    } catch (error) {
        console.error('Error retrieving key:', error);
        return '';
    }
}

export { saveKeyToFile, retrievekeyFromFile };