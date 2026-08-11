const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middleware/upload.middleware');
const storageController = require('../controllers/storage.controller');

// Upload endpoint accepting multipart/form-data with 'file' field
router.post('/storage/upload', uploadMiddleware.single('file'), storageController.uploadFile);

// Presign URL endpoint accepting file_url in body or query params
router.post('/storage/presign-url', storageController.presignUrl);
router.get('/storage/presign-url', storageController.presignUrl);

module.exports = router;
