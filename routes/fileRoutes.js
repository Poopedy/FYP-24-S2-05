// routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

router.post('/files', fileController.createFile);
router.get('/files/:fileId', fileController.getFileById);
router.get('/files/key/:keyid', fileController.getFileByKey);
router.get('/files', fileController.getAllFiles);
router.put('/files/:fileId', fileController.updateFile);
router.delete('/files/:fileId', fileController.deleteFile);

module.exports = router;
