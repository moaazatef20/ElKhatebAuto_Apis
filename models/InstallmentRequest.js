const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// تعريف هيكل (Schema) طلب التقسيط
const InstallmentRequestSchema = new Schema({
  // --- بيانات مقدم الطلب ---
  applicantName: {
    type: String,
    required: [true, 'الرجاء إدخال الاسم']
  },
  applicantPhone: {
    type: String,
    required: [true, 'الرجاء إدخال رقم الهاتف']
  },
  applicantEmail: {
    type: String // اختياري، ممكن يكون زائر
  },
  address: {
    type: String,
    required: [true, 'الرجاء إدخال العنوان']
  },

  // --- بيانات العمل والدخل (بناءً على إجاباتك) ---
  workType: {
    type: String,
    required: true,
    enum: ['employee', 'business_owner', 'unemployed'] // موظف - صاحب سجل - بدون عمل
  },
  employmentType: {
    type: String,
    enum: ['public_sector', 'private_sector', 'n/a'] // قطاع عام - خاص - لا ينطبق
  },
  residencyStatus: {
    type: String,
    enum: ['rent', 'owned', 'n/a'] // إيجار - تمليك - لا ينطبق
  },
  downPayment: {
    type: Number,
    required: [true, 'الرجاء إدخال قيمة المقدم']
  },

  // --- بيانات الطلب نفسه ---
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending' // الطلب أول ما يتبعت بيكون "قيد المراجعة"
  },
  
  // --- بيانات العربية المطلوبة (النقطة المهمة اللي طلبتها) ---
  carId: {
    type: Schema.Types.ObjectId,
    ref: 'Car', // بيربط الطلب ده بموديل "Car"
    default: null // اختياري: لو هو بيقدم على عربية من الموقع
  },
  customCarDescription: {
    type: String,
    default: null // اختياري: لو هو بيكتب عربية من دماغه
  },

  // --- ربط الطلب باليوزر (لو كان مسجل دخول) ---
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // بيربط الطلب ده بموديل "User"
    default: null // اختياري: لو هو زائر
  }
}, {
  timestamps: true // عشان نعرف الطلب ده وصل امتى بالظبط
});

module.exports = mongoose.model('InstallmentRequest', InstallmentRequestSchema);