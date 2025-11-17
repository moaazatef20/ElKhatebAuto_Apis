// ./models/sellRequest.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SellRequestSchema = new Schema({
  // --- بيانات البائع (القديمة + الجديدة) ---
  sellerName: {
    type: String,
    required: [true, 'الرجاء إدخال اسم البائع']
  },
  sellerPhone: {
    type: String,
    required: [true, 'الرجاء إدخال رقم هاتف البائع']
  },

  // --- [ 🔽 الحقول الجديدة الإجبارية 🔽 ] ---
  governorate: {
    type: String,
    required: [true, 'الرجاء اختيار المحافظة'],
    enum: [
      'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'المنوفية',
      'القليوبية', 'البحيرة', 'الغربية', 'بورسعيد', 'دمياط', 'الإسماعيلية',
      'السويس', 'كفر الشيخ', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط',
      'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر', 'الوادي الجديد',
      'مطروح', 'شمال سيناء', 'جنوب سيناء'
    ]
  },
  address: {
    type: String,
    required: [true, 'الرجاء إدخال العنوان بالتفصيل']
  },
  licenseExpiryDate: {
    type: String, // هنخليه String عشان يبقى سهل (العميل يكتب مثلاً "10/2025")
    required: [true, 'الرجاء إدخال تاريخ انتهاء الرخصة']
  },
  // --- [ 🔼 نهاية الحقول الجديدة 🔼 ] ---

  // --- بيانات العربية (زي ما هي) ---
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
  askingPrice: {
    type: Number,
    required: [true, 'الرجاء إدخال السعر المطلوب']
  },
  mileage: {
    type: Number,
    required: [true, 'الرجاء إدخال المسافة المقطوعة (كم)']
  },
  transmission: {
    type: String,
    required: [true, 'الرجاء اختيار ناقل الحركة'],
    enum: ['automatic', 'manual']
  },
  color: {
    type: String,
    required: [true, 'الرجاء إدخال اللون']
  },
  condition: {
    type: String,
    required: [true, 'الرجاء إدخال حالة السيارة']
  },
  
  // --- (الحقول الاختيارية زي ما هي) ---
  trim: { type: String, default: '' },
  adTitle: { type: String, default: '' },
  description: { type: String },
  
  // --- (حالة الطلب واليوزر) ---
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null 
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('SellRequest', SellRequestSchema);