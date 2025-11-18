const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('El Khateb Auto API is running...');
});

// تعريف كل الـ API Routes (بدون cashRequest)
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/cars', require('./routes/cars'));
app.use('/api/v1/requests', require('./routes/installmentRequests'));
app.use('/api/v1/sell-requests', require('./routes/sellRequests'));
app.use('/api/v1/feedback', require('./routes/feedback'));
app.use('/api/v1/dashboard', require('./routes/dashboard'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));