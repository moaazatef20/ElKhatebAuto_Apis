// ./models/cashRequest.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CashRequestSchema = new mongoose.Schema({
  senderName: {
    type: String,
    required: [true, 'الرجاء إدخال الاسم']
  },
  senderPhone: {
    type: String,
    required: [true, 'الرجاء إدخال رقم الهاتف']
  },
  governorate: {
    type: String,
    required: [true, 'الرجاء اختيار المحافظة'],
    enum: [
      'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'المنوفية',
      'القليوبية', 'البحيرة', 'الغربية', 'بورسعيد', 'دمياط', 'الإسماع промышленный',
      'السويس', 'كفر الشيخ', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط',
      'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر', 'الوادي الجديد',
      'مطروح', 'شمال سيناء', 'جنوب سيناء'
    ]
  },
  address: {
    type: String,
    required: [true, 'الرجاء إدخال العنوان']
  },
  carId: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
    default: null
  },
  customCarDescription: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'completed'],
    default: 'new'
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('CashRequest', CashRequestSchema);