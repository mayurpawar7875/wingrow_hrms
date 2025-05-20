// backend/controllers/marketFileController.js
const MarketFile = require('../models/MarketFile');

exports.uploadMarketFile = async (req, res) => {
  try {
    const { marketName, marketDate, fileType } = req.body;
    const filePath = req.file?.path;
    const userId = req.user.id; // from protect middleware

    if (!marketName || !marketDate || !fileType || !filePath) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const marketFile = new MarketFile({
      userId,
      marketName,
      marketDate,
      fileType,
      filePath,
    });

    await marketFile.save();

    res.status(201).json({ message: 'Market file uploaded successfully.' });
  } catch (error) {
    console.error('Error uploading market file:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
