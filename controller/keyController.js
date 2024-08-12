// controllers/keyController.js
const Key = require('../models/keyModel');

const keyController = {
    createKey: async (req, res) => {
        try {
            const keyData = req.body;
            await Key.create(keyData);
            res.status(201).json({ message: 'Key created successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
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

            if (keys.length === 0) {
                return res.status(404).json({ error: 'No keys found for this user' });
            }

            res.json(keys[0]);
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
            const keyid = req.params.keyid;
            const keyData = req.body;
            await Key.update(keyid, keyData);
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
