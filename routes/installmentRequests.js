// ./routes/installmentRequests.js
const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

const {
  submitInstallmentRequest,
  getInstallmentRequests,
  updateInstallmentRequestStatus,
  getMyInstallmentRequests,
  exportPendingRequests // <-- 1. ضيف الـ Controller الجديد هنا
} = require('../controllers/installmentRequestController');

// ... (المسارات اللي فوق زي ما هي)
router.post('/', submitInstallmentRequest);
router.get('/my-requests', protect, getMyInstallmentRequests);
router.get('/', [protect, authorize('admin')], getInstallmentRequests);
router.put('/:id/status', [protect, authorize('admin')], updateInstallmentRequestStatus);

// --- 🔽 أضف المسار الجديد ده 🔽 ---
// @desc    تصدير الطلبات (Pending) كملف CSV
// @route   GET /api/v1/requests/export/pending-csv
router.get(
  '/export/pending-csv',
  [protect, authorize('admin')],
  exportPendingRequests
);
// --- 🔼 ---

module.exports = router;