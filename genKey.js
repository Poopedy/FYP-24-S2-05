const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Generate a 32-byte (256-bit) key
const ENCRYPTION_KEY = crypto.randomBytes(32).toString('hex'); // 64-character hexadecimal string

// Define the file path
const filePath = path.join('/Users/bryan/Documents/GitHub/FYP-24-S2-05', 'encryptionKey.txt');

// Write the key to a file
fs.writeFile(filePath, ENCRYPTION_KEY, (err) => {
    if (err) {
        console.error('Error writing key to file:', err);
    } else {
        console.log(`Encryption key saved to ${filePath}`);
    }
});
