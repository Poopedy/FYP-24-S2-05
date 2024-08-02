// controllers/fileController.js
const File = require('../models/fileModel');

const fileController = {
    createFile: async (req, res) => {
        try {
            const fileData = req.body;
            await File.create(fileData);
            res.status(201).json({ message: 'File created successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    getFileById: async (req, res) => {
        try {
            const fileId = req.params.fileId;
            const file = await File.findById(fileId);
            if (!file) {
                return res.status(404).json({ message: 'File not found' });
            }
            res.json(file);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    getFileByKey: async (req, res) => {
        try {
            const keyId = req.params.keyid;
            const file = await File.findByKey(keyId);
            if (!file) {
                return res.status(404).json({ message: 'File not found' });
            }
            res.json(file);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    getAllFiles: async (req, res) => {
        try {
            const files = await File.getAll();
            res.json(files);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    updateFile: async (req, res) => {
        try {
            const fileId = req.params.fileId;
            const fileData = req.body;
            await File.update(fileId, fileData);
            res.json({ message: 'File updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    deleteFile: async (req, res) => {
        try {
            const fileId = req.params.fileId;
            await File.delete(fileId);
            res.json({ message: 'File deleted successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};

module.exports = fileController;
