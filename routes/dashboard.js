// ./routes/dashboard.js
const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

const { getDashboardStats } = require('../controllers/dashboardController'); // (لسه هنعمله)

// @desc    جلب إحصائيات لوحة التحكم (للأدمن فقط)
// @route   GET /api/v1/dashboard/stats
router.get('/stats', [protect, authorize('admin')], getDashboardStats);

module.exports = router;