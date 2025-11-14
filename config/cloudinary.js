const cloudinary = require('cloudinary').v2;
const CloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

// --- 🔽 [اختبار مؤقت] 🔽 ---
// إحنا كتبنا المفاتيح يدوياً هنا للتجربة
cloudinary.config({
  cloud_name: 'dpoerbowm',
  api_key: '835959723153386',
  api_secret: 'rUJIyNzZbGNkQN9SSwwZ7OIVIA2c'
});
// --- 🔼 [نهاية الاختبار] 🔼 ---

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'CarDealership',
    allowedFormats: ['jpg', 'png', 'jpeg']
  }
});

const upload = multer({ storage: storage });

module.exports = upload;