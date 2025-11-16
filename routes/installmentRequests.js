// ./routes/installmentRequests.js
const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

const {
  submitInstallmentRequest,
  getInstallmentRequests,
  updateInstallmentRequestStatus,
  getMyInstallmentRequests,
  exportPendingRequests,
  addInstallmentRequestNote // <-- 1. ضيف الـ Controller الجديد هنا
} = require('../controllers/installmentRequestController');

// ... (المسارات اللي فوق زي ما هي)
router.post('/', submitInstallmentRequest);
router.get('/my-requests', protect, getMyInstallmentRequests);
router.get('/', [protect, authorize('admin')], getInstallmentRequests);
router.put('/:id/status', [protect, authorize('admin')], updateInstallmentRequestStatus);
router.get('/export/pending-csv', [protect, authorize('admin')], exportPendingRequests);

// --- 🔽 أضف المسار الجديد ده 🔽 ---
// @desc    إضافة أو تعديل ملاحظات على طلب
// @route   PUT /api/v1/requests/:id/notes
router.put(
  '/:id/notes',
  [protect, authorize('admin')],
  addInstallmentRequestNote
);
// --- 🔼 ---

module.exports = router;