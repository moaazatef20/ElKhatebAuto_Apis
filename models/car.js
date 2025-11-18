// ./models/car.js
const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  make: {
    type: String,
    required: [true, 'الرجاء إدخال ماركة السيارة'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'الرجاء إدخال موديل السيارة'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'الرجاء إدخال سنة الصنع']
  },
  price: {
    type: Number,
    required: [true, 'الرجاء إدخال السعر']
  },
  minDownPayment: { // <-- [الإضافة الجديدة]
    type: Number,
    required: false,
    default: 0
  },
  description: {
    type: String,
    required: [true, 'الرجاء إدخال وصف للسيارة']
  },
  color: {
    type: String,
    required: [true, 'الرجاء إدخال لون السيارة']
  },
  category: {
    type: String,
    required: [true, 'الرجاء إدخال فئة السيارة']
  },
  transmission: {
    type: String,
    required: [true, 'الرجاء إدخال نوع ناقل الحركة'],
    enum: ['automatic', 'manual']
  },
  images: [
    {
      type: String, 
      required: true
    }
  ],
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Car', CarSchema);