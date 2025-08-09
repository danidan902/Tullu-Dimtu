const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Use __dirname directly (works in CommonJS)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { firstName, lastName, applyingGrade } = req.body;

    const folderName = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${applyingGrade}`;
    const uploadPath = path.join(__dirname, '../uploads', folderName);

    // Create folder if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = path.extname(file.originalname);
    cb(null, file.fieldname + uniqueSuffix); // like photo.jpg
  }
});

const upload = multer({ storage });

module.exports = upload;
