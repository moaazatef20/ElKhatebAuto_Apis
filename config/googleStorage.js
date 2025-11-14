// ./config/googleStorage.js
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

// --- [الكود بدون Base64] ---
// 1. اقرأ محتوى المتغير (اللي هو المفروض ملف الـ JSON)
const keyFileContent = process.env.GOOGLE_APPLICATION_CREDENTIALS;

// 2. اتأكد إنه مش فاضي
if (!keyFileContent) {
  throw new Error('متغير GOOGLE_APPLICATION_CREDENTIALS غير موجود أو فارغ.');
}

// 3. حوله من "نص" لـ "JSON"
const credentials = JSON.parse(keyFileContent);

// 4. إعدادات Storage
const storage = new Storage({
  credentials: credentials,
  projectId: credentials.project_id // بنقرأ الـ ID من الملف نفسه
});
// --- [نهاية الكود] ---

const bucketName = process.env.GCS_BUCKET_NAME;

if (!bucketName) {
  throw new Error('متغير GCS_BUCKET_NAME غير موجود أو فارغ.');
}

const bucket = storage.bucket(bucketName);

const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
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