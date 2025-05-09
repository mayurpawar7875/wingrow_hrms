const express = require('express');
const router = express.Router();
const { getAllMarkets } = require('../controllers/marketController'); // ✅ Correct import

router.get("/list", getAllMarkets); // ✅ Match frontend expectation

module.exports = router;
