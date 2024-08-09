// controllers/keyController.js
const Key = require('../models/keyModel');

const keyController = {
    createKey: async (req, res) => {
        try {
            const { userId, encryptedKey } = req.body;
            if (!userId || !encryptedKey) {
                return res.status(400).json({ error: 'User ID and encrypted key are required.' });
            }
            await Key.create(userId, encryptedKey);
            res.json({ message: 'Encryption key created successfully.' });
        } catch (err) {
            res.status(500).json({ message: 'Encryption key error' });
        }
    },
    getKeyById: async (req, res) => {
        try {
            const keyid = req.params.keyid;
            const key = await Key.findById(keyid);
            if (!key) {
                return res.status(404).json({ message: 'Key not found' });
            }
            res.json(key);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    getKeysByUserId: async (req, res) => {
        try {
            const uid = req.params.uid;
            const keys = await Key.findByUserId(uid);
            res.json(keys);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    getAllKeys: async (req, res) => {
        try {
            const keys = await Key.getAll();
            res.json(keys);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    updateKey: async (req, res) => {
        try {
            const userId = req.params.uid;
            const keyData = req.body;
            await Key.update(userId, keyData);
            res.json({ message: 'Key updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    deleteKey: async (req, res) => {
        try {
            const keyid = req.params.keyid;
            await Key.delete(keyid);
            res.json({ message: 'Key deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = keyController;
