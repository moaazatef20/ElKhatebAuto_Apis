// ./routes/feedback.js
const express = require('express');
const router = express.Router();

const { submitFeedback } = require('../controllers/feedbackController');

// @desc    إرسال شكوى أو مقترح
// @route   POST /api/v1/feedback
router.post('/', submitFeedback);

module.exports = router;