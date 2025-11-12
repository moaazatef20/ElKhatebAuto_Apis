// ./routes/cars.js
const express = require('express');
const router = express.Router();

// استدعاء الـ Middleware (الحراس)
const { protect, authorize } = require('../middleware/authMiddleware');

// استدعاء الـ Controllers (المنطق) - (لسه هنعملها)
const {
  getCars,
  getCarById,
  addCar,
  updateCar,
  deleteCar
} = require('../controllers/carController');

// --- المسارات العامة (Public Routes - للجميع) ---

// @desc    جلب كل السيارات المتاحة
// @route   GET /api/v1/cars
router.get('/', getCars);

// @desc    جلب سيارة واحدة بالتفاصيل
// @route   GET /api/v1/cars/:id
router.get('/:id', getCarById);

// --- المسارات المحمية (Admin Only Routes) ---

// @desc    إضافة سيارة جديدة
// @route   POST /api/v1/cars
router.post('/', [protect, authorize('admin')], addCar);

// @desc    تعديل بيانات سيارة
// @route   PUT /api/v1/cars/:id
router.put('/:id', [protect, authorize('admin')], updateCar);

// @desc    مسح سيارة
// @route   DELETE /api/v1/cars/:id
router.delete('/:id', [protect, authorize('admin')], deleteCar);

module.exports = router;