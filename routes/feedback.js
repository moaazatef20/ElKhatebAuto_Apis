const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { submitFeedback, getFeedback } = require('../controllers/feedbackController');

router.post('/', submitFeedback);
router.get('/', [protect, authorize('admin')], getFeedback);

module.exports = router;