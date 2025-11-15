// ./routes/cars.js
const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

const {
  getCars,
  getCarById,
  addCar,
  updateCar,
  deleteCar
} = require('../controllers/carController');

router.get('/', getCars);
router.get('/:id', getCarById);

// --- 🔽 بص هنا، رجع بسيط جداً 🔽 ---
router.post('/', [protect, authorize('admin')], addCar);
// --- 🔼 ---

router.put('/:id', [protect, authorize('admin')], updateCar);
router.delete('/:id', [protect, authorize('admin')], deleteCar);

module.exports = router;