// ===== routes/extra.js =====
require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const User = require("../models/User");

const router = express.Router();

/* ===================================
   🔒 Middleware xác thực token
   =================================== */
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "❌ Thiếu token xác thực!" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "❌ Token không hợp lệ hoặc đã hết hạn!" });
  }
}

/* ===================================
   ⚙️ Cấu hình Mailtrap SMTP
   =================================== */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ===================================
   ⚙️ Cấu hình Cloudinary
   =================================== */
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

/* ===================================
   ⚙️ Multer - upload tạm ảnh
   =================================== */
const storage = multer.diskStorage({});
const upload = multer({ storage });

/* ===================================
   👑 GET /extra/users – Danh sách người dùng
   =================================== */
router.get("/users", verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    if (!currentUser || currentUser.role !== "admin") {
      return res.status(403).json({
        message: "🚫 Chỉ admin mới được phép xem danh sách người dùng!",
      });
    }

    const users = await User.find().select("-password");
    res.json({ users });
  } catch (err) {
    console.error("❌ Lỗi tải danh sách người dùng:", err);
    res.status(500).json({ message: "❌ Lỗi server!", error: err.message });
  }
});

/* ===================================
   🔹 POST /extra/forgot-password
   =================================== */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ message: "Vui lòng nhập email!" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Email không tồn tại!" });

    const resetToken = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "15m",
    });

    const resetLink = `http://192.168.38.221:3000/reset-password/${resetToken}`;
    console.log("🔑 Token tạo ra:", resetToken);

    await transporter.sendMail({
      from: '"Hệ thống hỗ trợ" <no-reply@example.com>',
      to: email,
      subject: "🔑 Yêu cầu đặt lại mật khẩu",
      html: `
        <h3>Xin chào ${user.email}</h3>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu.</p>
        <p>Nhấn vào link dưới đây để đặt lại mật khẩu (hết hạn sau 15 phút):</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
      `,
    });

    res.json({ message: "✅ Đã gửi email đặt lại mật khẩu!" });
  } catch (err) {
    console.error("❌ Lỗi gửi mail:", err);
    res
      .status(500)
      .json({ message: "Lỗi server khi gửi email!", error: err.message });
  }
});

/* ===================================
   🔹 POST /extra/reset-password/:token
   =================================== */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password)
      return res.status(400).json({ message: "Vui lòng nhập mật khẩu mới!" });

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "✅ Mật khẩu đã được đặt lại thành công!" });
  } catch (err) {
    console.error("❌ Lỗi reset mật khẩu:", err);
    res.status(400).json({
      message: "❌ Token không hợp lệ hoặc đã hết hạn!",
      error: err.message,
    });
  }
});

/* ===================================
   🔹 POST /extra/upload-avatar
   =================================== */
router.post("/upload-avatar", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Chưa chọn ảnh!" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
    });

    const { userId } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: result.secure_url },
      { new: true }
    );

    res.json({
      message: "✅ Upload avatar thành công!",
      avatarUrl: result.secure_url,
      user,
    });
  } catch (err) {
    console.error("❌ Lỗi upload avatar:", err);
    res
      .status(500)
      .json({ message: "Lỗi upload ảnh!", error: err.message });
  }
});
/* ===================================
   ❌ DELETE /extra/users/:id – Xóa người dùng
   =================================== */
router.delete("/users/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = await User.findById(req.user.userId);

    if (!currentUser)
      return res
        .status(404)
        .json({ message: "❌ Không tìm thấy người dùng hiện tại!" });

    // ✅ Admin có thể xóa bất kỳ user nào
    // ✅ User thường chỉ được xóa chính họ
    if (currentUser.role !== "admin" && currentUser._id.toString() !== id) {
      return res
        .status(403)
        .json({ message: "🚫 Bạn không có quyền xóa người dùng khác!" });
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
