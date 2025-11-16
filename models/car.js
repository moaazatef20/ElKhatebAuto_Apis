const mongoose = require('mongoose');

// تعريف هيكل (Schema) السيارة
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
  color: {
    type: String,
    required: [true, 'الرجاء إدخال لون السيارة']
  },
  category: {
    type: String,
    required: [true, 'الرجاء إدخال فئة السيارة (مثل: سيدان، دفع رباعي...)']
  },
  transmission: {
    type: String,
    required: [true, 'الرجاء إدخال نوع ناقل الحركة'],
    enum: ['automatic', 'manual'] // (أوتوماتيك أو يدوي)
  },
  year: {
    type: Number,
    required: [true, 'الرجاء إدخال سنة الصنع']
  },
  price: {
    type: Number,
    required: [true, 'الرجاء إدخال السعر']
  },
  description: {
    type: String,
    required: [true, 'الرجاء إدخال وصف للسيارة']
  },
  images: [
    {
      type: String, // هنخزن هنا لينكات الصور (URLs)
      required: true
    }
  ],
  isAvailable: {
    type: Boolean,
    default: true // أول ما العربية تنضاف، هي افتراضياً "متاحة"
  }
  // مش محتاجين نربط العربية بالأدمن اللي ضافها (إلا لو حبيت)
  // لأن كل العربيات تبع المعرض

}, {
  timestamps: true // عشان نعرف امتى العربية اتضافت أو اتعدلت
});

module.exports = mongoose.model('Car', CarSchema);