// ./routes/installmentRequests.js
const express = require('express');
const router = express.Router();

// استدعاء الحراس
const { protect, authorize } = require('../middleware/authMiddleware');

// استدعاء الـ Controllers (لسه هنعملها)
const {
  submitInstallmentRequest,
  getInstallmentRequests,
  updateInstallmentRequestStatus,
  getMyInstallmentRequests
} = require('../controllers/installmentRequestController');

// --- المسار العام (Public Route) ---

// @desc    إرسال طلب تقسيط جديد (للزائر أو المستخدم)
// @route   POST /api/v1/requests
router.post('/', submitInstallmentRequest); // مفتوح للجميع

// --- المسارات المحمية (User Routes) ---

// @desc    جلب طلبات التقسيط الخاصة بالمستخدم المسجل
// @route   GET /api/v1/requests/my-requests
router.get('/my-requests', protect, getMyInstallmentRequests); // لازم يكون مسجل دخول

// --- المسارات المحمية (Admin Only Routes) ---

// @desc    جلب كل طلبات التقسيط (للأدمن)
// @route   GET /api/v1/requests
router.get('/', [protect, authorize('admin')], getInstallmentRequests); // لازم أدمن

// @desc    تعديل حالة طلب تقسيط (قبول/رفض)
// @route   PUT /api/v1/requests/:id/status
router.put('/:id/status', [protect, authorize('admin')], updateInstallmentRequestStatus); // لازم أدمن

module.exports = router;