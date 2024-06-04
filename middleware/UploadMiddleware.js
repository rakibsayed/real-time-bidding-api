const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
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

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

const uploadImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).send({ error: err.message });
    }
    next(); // Call next middleware in the chain
  });
};

module.exports = uploadImage;
