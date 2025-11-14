// ./routes/cars.js
const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');
const { upload, uploadToGcs } = require('../config/googleStorage');

const {
  getCars,
  getCarById,
  addCar,
  updateCar,
  deleteCar
} = require('../controllers/carController');

router.get('/', getCars);

router.get('/:id', getCarById);

router.post(
  '/',
  [protect, authorize('admin')],
  upload.array('images', 5),
  uploadToGcs,
  addCar
);

router.put('/:id', [protect, authorize('admin')], updateCar);

router.delete('/:id', [protect, authorize('admin')], deleteCar);

module.exports = router;