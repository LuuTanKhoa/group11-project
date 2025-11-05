const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

/* =======================================
   🔒 Middleware: Xác thực JWT Token
   ======================================= */
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: '❌ Thiếu token xác thực!' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, 'SECRET_KEY', (err, decoded) => {
    if (err)
      return res
        .status(403)
        .json({ message: '❌ Token không hợp lệ hoặc đã hết hạn!' });
    req.user = decoded; // Lưu thông tin user vào request
    next();
  });
}

/* =======================================
   🧩 Middleware: Kiểm tra quyền Admin
   ======================================= */
async function isAdmin(req, res, next) {
  try {
    const currentUser = await User.findById(req.user.userId);
    if (!currentUser || currentUser.role !== 'admin') {
      return res.status(403).json({ message: '🚫 Bạn không có quyền Admin!' });
    }
    next();
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Lỗi server khi kiểm tra quyền!', error: err.message });
  }
}

/* =======================================
   📋 GET /users – Chỉ Admin xem danh sách
   ======================================= */
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Ẩn password
    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: '❌ Lỗi khi lấy danh sách người dùng!',
      error: err.message,
    });
  }
});

/* =======================================
   📜 GET /users/me – Lấy thông tin bản thân
   ======================================= */
router.get('/me', verifyToken, async (req, res) => {
  try {
    const me = await User.findById(req.user.userId).select('-password');
    if (!me)
      return res.status(404).json({ message: '❌ Không tìm thấy người dùng!' });
    res.json(me);
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi server!', error: err.message });
  }
});

/* =======================================
   ✏️ PUT /users/:id – Cập nhật thông tin user
   ======================================= */
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, role } = req.body;

    const currentUser = await User.findById(req.user.userId);
    if (!currentUser)
      return res.status(404).json({ message: '❌ Không tìm thấy người dùng hiện tại!' });

    // ✅ User thường chỉ được sửa chính mình
    if (currentUser.role !== 'admin' && currentUser._id.toString() !== id) {
      return res.status(403).json({ message: '🚫 Bạn không thể sửa người khác!' });
    }

    // ✅ Chỉ admin mới được phép đổi role
    if (role && currentUser.role !== 'admin') {
      return res.status(403).json({ message: '🚫 Bạn không có quyền đổi role!' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, phone, address, ...(role && { role }) },
      { new: true }
    ).select('-password');

    if (!updatedUser)
      return res.status(404).json({ message: '❌ Không tìm thấy user cần cập nhật!' });

    res.json({
      message: '✅ Cập nhật thông tin người dùng thành công!',
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      message: '❌ Lỗi server khi cập nhật!',
      error: err.message,
    });
  }
});

/* =======================================
   ❌ DELETE /users/:id – Admin hoặc Chính chủ
   ======================================= */
router.delete("/users/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = await User.findById(req.user.userId);

    if (!currentUser)
      return res.status(404).json({ message: "❌ Không tìm thấy người dùng hiện tại!" });

    if (currentUser.role !== "admin" && currentUser._id.toString() !== id) {
      return res.status(403).json({ message: "🚫 Bạn không có quyền xóa người dùng khác!" });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser)
      return res.status(404).json({ message: "❌ Người dùng không tồn tại!" });

    res.json({ message: "✅ Đã xóa người dùng thành công!" });
  } catch (err) {
    console.error("❌ Lỗi khi xóa user:", err);
    res.status(500).json({ message: "❌ Lỗi server khi xóa user!" });
  }
});

module.exports = router;
