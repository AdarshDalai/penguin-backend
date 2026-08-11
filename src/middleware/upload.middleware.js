const multer = require('multer');

// Store file in memory as Buffer for direct upload to Supabase storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB limit default
  },
});

module.exports = upload;
