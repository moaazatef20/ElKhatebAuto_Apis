const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// تعريف هيكل (Schema) طلب بيع السيارة
const SellRequestSchema = new Schema({
  // --- بيانات البائع ---
  sellerName: {
    type: String,
    required: [true, 'الرجاء إدخال اسم البائع']
  },
  sellerPhone: {
    type: String,
    required: [true, 'الرجاء إدخال رقم هاتف البائع للتواصل']
  },
  
  // --- بيانات السيارة المعروضة للبيع ---
  make: {
    type: String,
    required: [true, 'الرجاء إدخال ماركة السيارة']
  },
  model: {
    type: String,
    required: [true, 'الرجاء إدخال موديل السيارة']
  },
  year: {
    type: Number,
    required: [true, 'الرجاء إدخال سنة الصنع']
  },
  condition: {
    type: String,
    required: [true, 'الرجاء إدخال حالة السيارة (مثل: فابريكا، راشة...)']
  },
  askingPrice: {
    type: Number,
    required: [true, 'الرجاء إدخال السعر المطلوب']
  },
  images: [
    {
      type: String, // لينكات صور العربية
      required: true
    }
  ],
  description: {
    type: String // وصف إضافي أو ملاحظات من البائع
  },

  // --- حالة الطلب (للأدمن) ---
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending' // الطلب أول ما يتبعت بيكون "قيد المراجعة"
  },

  // --- ربط الطلب باليوزر (لو كان مسجل دخول) ---
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null // اختياري لو البائع زائر
  }
}, {
  timestamps: true // عشان نعرف الطلب ده اتقدم امتى
});

module.exports = mongoose.model('SellRequest', SellRequestSchema);