const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.set('debug', true);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 👉 Kết nối MongoDB Atlas
mongoose.connect('mongodb+srv://phucdatnguyen2505_db_user:123abc@cluster0.hta2207.mongodb.net/?appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 👉 Kiểm tra route có tồn tại không
try {
  const userRoutes = require('./routes/user');
  app.use('/users', userRoutes);
} catch (err) {
  console.warn('⚠️ Route ./routes/user.js chưa tồn tại hoặc lỗi import');
}

// 👉 Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


// === BACKEND NEW FEATURE TEST ===
app.get('/test-backend', (req, res) => {
  res.send('✅ Backend route hoạt động!');
});


