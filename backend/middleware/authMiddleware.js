// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Lưu ý: chữ U viết hoa nếu file là User.js

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: '❌ Không có token, vui lòng đăng nhập!' });
    }

    const decoded = jwt.verify(token, 'secret_key');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: '❌ Người dùng không tồn tại!' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: '❌ Token không hợp lệ hoặc đã hết hạn!', error: err.message });
  }
};

module.exports = authMiddleware;
