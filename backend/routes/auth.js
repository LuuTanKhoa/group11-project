// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

const router = express.Router();

/* ======================================
   📝 POST /auth/signup – Đăng ký tài khoản
   ====================================== */
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "❌ Email đã tồn tại!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Thêm mặc định role: "user"
    const newUser = new User({
      email,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();
    res.json({ message: "✅ Đăng ký thành công!", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "❌ Lỗi đăng ký!", error: error.message });
  }
});

/* ======================================
   🔐 POST /auth/login – Đăng nhập
   ====================================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu không chính xác!" });

    // ✅ Token chứa userId, email, role
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.SECRET_KEY || "SECRET_KEY",
      { expiresIn: "3h" }
    );

    res.json({
      message: "✅ Đăng nhập thành công!",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Lỗi đăng nhập!", error: error.message });
  }
});

/* ======================================
   🚪 POST /auth/logout – Đăng xuất
   ====================================== */
router.post("/logout", (req, res) => {
  res.json({ message: "✅ Đăng xuất thành công (xoá token phía client)" });
});

/* ======================================
   🧪 GET /auth/test – Kiểm tra route hoạt động
   ====================================== */
router.get("/test", (req, res) => {
  res.send("✅ Auth route hoạt động!");
});



  


module.exports = router;