const encryptModel = require('../models/encryptionModel');
const decryptModel = require('../models/decryptionModel');

const encryptionController = {
    encrypt: async (req, res) => {
        const file = req.file; // assuming the file is sent in the request body
        try {
            const { encryptedBlob, iv } = await encryptModel.encryptFile(file);
            res.json({ encryptedBlob, iv });
        } catch (error) {
            console.error('Encryption error:', error);
            res.status(500).json({ error: 'Encryption failed' });
        }
    },

    decrypt: async (req, res) => {
        const encryptedBlob = req.file; // assuming the encrypted blob is sent in the request body
        try {
            const decryptedBlob = await decryptModel.decryptFile(encryptedBlob);
            res.json({ decryptedBlob });
        } catch (error) {
            console.error('Decryption error:', error);
            res.status(500).json({ error: 'Decryption failed' });
        }
    }
};

module.exports = encryptionController;