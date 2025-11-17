// ./models/feedback.js
const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  feedbackType: {
    type: String,
    required: [true, 'يجب تحديد نوع الرسالة'],
    enum: ['complaint', 'suggestion']
  },
  message: {
    type: String,
    required: [true, 'نص الرسالة إجباري']
  },
  senderName: {
    type: String,
    required: [true, 'اسم المرسل إجباري']
  },
  senderPhone: {
    type: String,
    required: [true, 'هاتف المرسل إجباري']
  },
  status: {
    type: String,
    enum: ['new', 'read', 'resolved'],
    default: 'new'
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('Feedback', FeedbackSchema);