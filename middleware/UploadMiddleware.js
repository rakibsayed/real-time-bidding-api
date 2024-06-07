const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { errorSymbol } = require('../utils/consoleSymbols');

// Define storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define upload directory
    const uploadDir = path.join(__dirname, "..", "uploads");

    // Check if the directory exists, create it if it doesn't
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let fileName = file.fieldname + "-" + uniqueSuffix;

    // Add '-test' suffix to file name in testing environment
    if (process.env.NODE_ENV === "test") {
      fileName += "-test";
    }

    fileName += path.extname(file.originalname);

    cb(null, fileName);
  },
});

// Initialize multer with storage and file size limit
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

// Middleware function to handle file upload
const uploadImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      // Log error and send error response
      console.error(`${errorSymbol} Upload failed:`, err.message);
      return res.status(400).send({ error: err.message });
    }
    // Call next middleware in the chain
    next();
  });
};

module.exports = uploadImage;
