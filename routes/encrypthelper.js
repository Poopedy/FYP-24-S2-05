const crypto = require('crypto');

// Placeholder encryption key (32 bytes long)
const ENCRYPTION_KEY = '80b928fdd7121bfe67cd2258072f8adac56be9b6ee522dfc5e3c06aa54021897'; // Replace with a secure key later

function encryptCloud(text) {
    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error) {
        console.error('Encryption error:', error);
        // Optionally, return a default value or throw a custom error
        return null; // or handle as needed
    }
}

function decryptCloud(text) {
    try {
        const textParts = text.split(':');
        if (textParts.length !== 2) {
            throw new Error('Invalid input format');
        }

        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.error('Decryption error:', error);
        // Optionally, return a default value or throw a custom error
        return null; // or handle as needed
    }
}

module.exports = { encryptCloud, decryptCloud };
