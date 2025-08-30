const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'data-' + uniqueSuffix + '.zip');
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed') {
    cb(null, true);
  } else {
    cb(new Error('Only ZIP files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

module.exports = upload;