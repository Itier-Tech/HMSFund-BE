const multer = require("multer");

// Configure multer for handling file uploads.
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;