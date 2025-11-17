const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config(); // تفعيل ملف .env
connectDB();

const app = express();

// Middleware عشان السيرفر يفهم الـ JSON اللي هيجيله في الـ requests
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000' 
}));
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/cars', require('./routes/cars'));
app.use('/api/v1/requests', require('./routes/installmentRequests'));
app.use('/api/v1/sell-requests', require('./routes/sellRequests'));
app.use('/api/v1/feedback', require('./routes/feedback'));
app.use('/api/v1/cash-requests', require('./routes/cashRequest'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/dashboard', require('./routes/dashboard'));
app.get('/', (req, res) => {
  res.send('Car Dealership API is running...');
});

const PORT = process.env.PORT || 5000;

// تشغيل السيرفر
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));