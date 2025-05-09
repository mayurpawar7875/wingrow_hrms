const multer = require('multer');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the directory for uploads
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Set the file name
  }
});

const upload = multer({ storage }).single('file');

// @desc    Upload media file for market operations
// @route   POST /api/market/upload
// @access  Private
exports.uploadMedia = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to upload file', error: err });
    }
    res.status(200).json({ message: 'File uploaded successfully', filePath: req.file.path });
  });
};
