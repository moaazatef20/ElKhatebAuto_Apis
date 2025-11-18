// ./routes/cashRequest.js
const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');
const { 
  submitCashRequest, 
  getCashRequests, 
  updateCashRequestStatus 
} = require('../controllers/cashRequestController');

// (عام)
router.post('/', submitCashRequest);

// (للأدمن)
router.get('/', [protect, authorize('admin')], getCashRequests);

// (للأدمن)
router.put('/:id/status', [protect, authorize('admin')], updateCashRequestStatus);

module.exports = router;