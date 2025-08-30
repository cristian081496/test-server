const express = require('express');
const upload = require('../middleware/upload');
const { uploadZipFile } = require('../controllers/uploadController');

const router = express.Router();

router.post('/', upload.single('zipFile'), uploadZipFile);

module.exports = router;