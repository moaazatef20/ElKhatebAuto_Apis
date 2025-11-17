// ./controllers/feedbackController.js
const Feedback = require('../models/feedback');

/**
 * @desc    إرسال شكوى أو مقترح جديد
 * @route   POST /api/v1/feedback
 * @access  Public
 */
exports.submitFeedback = async (req, res) => {
  try {
    const { feedbackType, message, senderName, senderPhone } = req.body;

    const newFeedback = await Feedback.create({
      feedbackType,
      message,
      senderName,
      senderPhone
    });

    res.status(201).json({
      success: true,
      message: 'تم إرسال رسالتك بنجاح، شكراً لك',
      data: newFeedback
    });

  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'بيانات غير مكتملة',
        data: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'حدث خطأ في السيرفر',
      data: null
    });
  }
};


/**
 * @desc    جلب كل الشكاوى والمقترحات (للأدمن)
 * @route   GET /api/v1/feedback
 * @access  Private (Admin)
 */
exports.getFeedback = async (req, res) => {
  try {
    const feedbackItems = await Feedback.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'تم جلب جميع الشكاوى والمقترحات بنجاح',
      data: feedbackItems
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في السيرفر',
      data: null
    });
  }
};