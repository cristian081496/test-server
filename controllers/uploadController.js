const { processZipFile } = require('../services/zipProcessor');

const uploadZipFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const result = await processZipFile(req.file.path);
    
    res.json({
      message: result.message,
      data: result
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        error: `Duplicate entry: ${error.errors[0].path} '${error.errors[0].value}' already exists`,
        details: error.errors[0].message
      });
    }
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors.map(err => `${err.path}: ${err.message}`).join(', ')
      });
    }
    
    if (error.message.includes('Missing required files')) {
      return res.status(400).json({ 
        error: 'Invalid ZIP file: Missing required files (userData.json, transactions.json, avatar.png)'
      });
    }
    
    if (error.message.includes('JSON parse')) {
      return res.status(400).json({ 
        error: 'Invalid JSON format in ZIP file',
        details: error.message
      });
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
};

module.exports = {
  uploadZipFile
};