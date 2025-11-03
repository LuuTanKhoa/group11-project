// routes/profile.js
const express = require("express");
const router = express.Router();
const User = require("../models/User"); // import model User
const authMiddleware = require('../middleware/authMiddleware');


// ✅ API xem thông tin cá nhân
router.get("/profile", async (req, res) => {
  try {
    const { id } = req.query; // lấy user id từ query
    const user = await User.findById(id).select("-password"); // không trả password

    if (!user) {
      return res.status(404).json({ message: "❌ Không tìm thấy người dùng!" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server!", error: err.message });
  }
});

// ✅ API cập nhật thông tin cá nhân
router.put("/profile", async (req, res) => {
  try {
    const { id } = req.query; // id người dùng cần cập nhật
    const { name, email, phone } = req.body; // thông tin gửi từ frontend

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, phone },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "❌ Không tìm thấy người dùng!" });
    }

    res.json({
      message: "✅ Cập nhật thông tin thành công!",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server!", error: err.message });
  }
});

module.exports = router;
