// ./routes/sellRequests.js
const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

const {
  submitSellRequest,
  getSellRequests,
  updateSellRequestStatus,
  exportSellRequests // <-- 1. ضيف الـ Controller الجديد هنا
} = require('../controllers/sellRequestController');

router.post('/', submitSellRequest);

router.get('/', [protect, authorize('admin')], getSellRequests);

router.put('/:id/status', [protect, authorize('admin')], updateSellRequestStatus);

// --- 🔽 أضف المسار الجديد ده 🔽 ---
// @desc    تصدير عروض البيع (Pending) كملف CSV
// @route   GET /api/v1/sell-requests/export/pending-csv
router.get(
  '/export/pending-csv',
  [protect, authorize('admin')],
  exportSellRequests
);
// --- 🔼 ---

module.exports = router;