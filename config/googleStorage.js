const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: process.env.GOOGLE_PROJECT_ID 
});

const bucketName = process.env.GCS_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // حد أقصى 5 ميجا للصورة
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('يجب أن تكون الملفات صور (jpg, png, jpeg) فقط'));
  }
});

const uploadToGcs = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  const uploadPromises = req.files.map(file => {
    return new Promise((resolve, reject) => {
      const blob = bucket.blob(`cars/${Date.now()}-${file.originalname}`);
      const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
          contentType: file.mimetype
        }
      });

      blobStream.on('error', (err) => {
        reject(err);
      });

      blobStream.on('finish', () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
        resolve(publicUrl);
      });

      blobStream.end(file.buffer);
    });
  });

  Promise.all(uploadPromises)
    .then(publicUrls => {
      req.publicUrls = publicUrls;
      next();
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ 
        success: false, 
        message: 'فشل رفع الصور إلى Google Storage' 
      });
    });
};

module.exports = { upload, uploadToGcs };