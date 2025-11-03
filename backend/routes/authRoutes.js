const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// 🔹 POST /signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã tồn tại!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: "Đăng ký thành công!", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Lỗi đăng ký!", error: error.message });
  }
});

// 🔹 POST /login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu không chính xác" });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      "SECRET_KEY", // 🔐 thay bằng biến môi trường thực tế
      { expiresIn: "1h" }
    );

    res.json({ message: "Đăng nhập thành công!", token });
  } catch (error) {
    res.status(500).json({ message: "Lỗi đăng nhập!", error: error.message });
  }
});

// 🔹 POST /logout
router.post("/logout", (req, res) => {
  // Client chỉ cần xoá token trong localStorage
  res.json({ message: "Đăng xuất thành công (client xoá token)" });
});

module.exports = router;
