// ./routes/cars.js
const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary'); // <-- 1. استدعي الملف الجديد

const {
  getCars,
  getCarById,
  addCar,
  updateCar,
  deleteCar
} = require('../controllers/carController');

// ... (مسارات GET زي ما هي)
router.get('/', getCars);
router.get('/:id', getCarById);

// --- 🔽 تعديل المسار ده 🔽 ---
// @desc    إضافة سيارة جديدة
// @route   POST /api/v1/cars
router.post(
  '/',
  [protect, authorize('admin')],
  upload.array('images', 5), // <-- 2. ضيف الـ Middleware ده
  addCar
);
// --- 🔼 ---

// ... (مسارات PUT و DELETE زي ما هي)
router.put('/:id', [protect, authorize('admin')], updateCar);
router.delete('/:id', [protect, authorize('admin')], deleteCar);

module.exports = router;