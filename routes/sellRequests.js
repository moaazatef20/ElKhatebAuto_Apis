// ./routes/sellRequests.js
const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

const {
  submitSellRequest,
  getSellRequests,
  updateSellRequestStatus
} = require('../controllers/sellRequestController'); // (لسه هنعمله)

// --- المسار العام (Public Route) ---

// @desc    إرسال طلب بيع سيارة (للزائر أو المستخدم)
// @route   POST /api/v1/sell-requests
router.post('/', submitSellRequest); // مفتوح للجميع

// --- المسارات المحمية (Admin Only Routes) ---

// @desc    جلب كل طلبات بيع السيارات (للأدمن)
// @route   GET /api/v1/sell-requests
router.get('/', [protect, authorize('admin')], getSellRequests);

// @desc    تعديل حالة طلب بيع (قبول/رفض/مراجعة)
// @route   PUT /api/v1/sell-requests/:id/status
router.put('/:id/status', [protect, authorize('admin')], updateSellRequestStatus);

module.exports = router;