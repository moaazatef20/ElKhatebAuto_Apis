// ./routes/users.js
const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

const { getUsers, getMyProfile } = require('../controllers/userController'); // (لسه هنعمله)

// @desc    جلب الملف الشخصي للمستخدم المسجل
// @route   GET /api/v1/users/me
router.get('/me', protect, getMyProfile);

// @desc    جلب كل العملاء (للأدمن فقط)
// @route   GET /api/v1/users
router.get('/', [protect, authorize('admin')], getUsers);

module.exports = router;