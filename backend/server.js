// Import thư viện express
const express = require('express');
const app = express();

// Cho phép đọc dữ liệu JSON từ body request
app.use(express.json());

// Import routes
const userRoutes = require('./routes/user');

// Sử dụng route
app.use('/', userRoutes);

// Tạo cổng chạy server
const PORT = process.env.PORT || 3000;

// Chạy server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
