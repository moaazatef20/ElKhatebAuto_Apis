//  ./config/db.js
const mongoose = require('mongoose');
require('dotenv').config(); // عشان يقدر يقرأ المتغيرات من ملف .env

const connectDB = async () => {
  try {
    // بنحاول نتصل بالداتابيز عن طريق الرابط اللي في .env
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB Connected...'); // نطبع رسالة نجاح
  } catch (err) {
    console.error(err.message);
    // لو الاتصال فشل، بنقفل السيرفر
    process.exit(1);
  }
};

module.exports = connectDB;