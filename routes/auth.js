// ./routes/auth.js
const express = require('express');
const router = express.Router();

// هنجيب الـ functions اللي لسه هنعملها من الـ Controller
const { registerUser, loginUser } = require('../controllers/authController');

// المسار ده: POST /api/v1/auth/register
// الوظيفة: إنشاء حساب مستخدم جديد
router.post('/register', registerUser);

// المسار ده: POST /api/v1/auth/login
// الوظيفة: تسجيل دخول مستخدم
router.post('/login', loginUser);

module.exports = router;