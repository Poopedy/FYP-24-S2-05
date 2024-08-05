// routes/keyRoutes.js
const express = require('express');
const router = express.Router();
const keyController = require('../controller/keyController');

router.post('/keys', keyController.createKey);
router.get('/keys/:keyid', keyController.getKeyById);
router.get('/keys/user/:uid', keyController.getKeysByUserId);
router.get('/keys', keyController.getAllKeys);
router.put('/keys/:keyid', keyController.updateKey);
router.delete('/keys/:keyid', keyController.deleteKey);

module.exports = router;
