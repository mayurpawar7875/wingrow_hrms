// backend/routes/marketFileRoutes.js
const express = require('express');
const router = express.Router();
const { uploadMarketFile } = require('../controllers/marketFileController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// Single API for uploading either market video or cleaning video
router.post('/upload-market-file', protect, upload.single('file'), uploadMarketFile);

module.exports = router;
