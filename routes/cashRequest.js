// ./routes/cashRequest.js
const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');
const { 
  submitCashRequest, 
  getCashRequests, 
  updateCashRequestStatus 
} = require('../controllers/cashRequestController');

router.post('/', submitCashRequest);
router.get('/', [protect, authorize('admin')], getCashRequests);
router.put('/:id/status', [protect, authorize('admin')], updateCashRequestStatus);

module.exports = router;