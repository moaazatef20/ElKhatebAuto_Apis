const mongoose = require('mongoose');

// تعريف هيكل (Schema) المستخدم
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'الرجاء إدخال الاسم'], // مطلوب
    trim: true // بيشيل أي مسافات فاضية في الأول والآخر
  },
  email: {
    type: String,
    required: [true, 'الرجاء إدخال البريد الإلكتروني'],
    unique: true, // الإيميل مينفعش يتكرر
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'الرجاء إدخال بريد إلكتروني صالح'
    ] // للتأكد إن الفورمات بتاع الإيميل صح
  },
  phone: {
    type: String,
    required: [true, 'الرجاء إدخال رقم الهاتف']
  },
  password: {
    type: String,
    required: [true, 'الرجاء إدخال كلمة السر'],
    minlength: [6, 'كلمة السر يجب أن تكون 6 أحرف على الأقل']
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // القيم المسموحة بس
    default: 'user' // القيمة الافتراضية لو مدخلناش حاجة
  }
}, {
  // إضافة تاريخ الإنشاء والتعديل أوتوماتيك
  timestamps: true 
});

// تصدير (Export) النموذج عشان نقدر نستخدمه في باقي الملفات
module.exports = mongoose.model('User', UserSchema);