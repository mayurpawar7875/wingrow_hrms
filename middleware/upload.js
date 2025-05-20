const multer = require('multer');
const path = require('path');

// ✅ File Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// ✅ Corrected File Filter
const fileFilter = (req, file, cb) => {
  const mimetype = file.mimetype;
  const extname = path.extname(file.originalname).toLowerCase(); 

  if (
    mimetype.startsWith('image/') ||
    mimetype.startsWith('video/') ||
    mimetype === 'application/octet-stream' // <-- Important to allow octet-stream from Flutter!
  ) {
    if (['.jpg', '.jpeg', '.png', '.mp4', '.mov', '.avi', '.mkv'].includes(extname)) {
      cb(null, true);
    } else {
      cb(new Error('❌ Only .jpg, .png, .mp4, .mov, .avi, .mkv files are allowed!'), false);
    }
  } else {
    cb(new Error('❌ Only image and video files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
