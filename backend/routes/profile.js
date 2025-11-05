const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const User = require("../models/User");

const router = express.Router();

/* ==========================================================
   ⚙️ Cấu hình Multer + Cloudinary
   ========================================================== */
const storage = multer.diskStorage({});
const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

/* ==========================================================
   ✅ Middleware xác thực JWT
   ========================================================== */
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "❌ Không có token!" });

  const [bearer, token] = authHeader.split(" ");
  if (bearer !== "Bearer" || !token)
    return res
      .status(401)
      .json({ message: "❌ Header Authorization không hợp lệ!" });

  // ✅ Dùng SECRET_KEY từ .env
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err)
      return res
        .status(403)
        .json({ message: "❌ Token không hợp lệ hoặc đã hết hạn!" });

    req.user = decoded;
    next();
  });
}

/* ==========================================================
   ✅ GET /profile - lấy thông tin người dùng hiện tại
   ========================================================== */
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    if (!userId)
      return res.status(400).json({ message: "❌ Token không chứa userId!" });

    const user = await User.findById(userId).select("-password");
    if (!user)
      return res.status(404).json({ message: "❌ Không tìm thấy người dùng!" });

    res.json(user);
  } catch (err) {
    console.error("❌ Lỗi GET /profile:", err);
    res.status(500).json({ message: "Lỗi server khi lấy profile." });
  }
});

/* ==========================================================
   ✅ PUT /profile - cập nhật thông tin + avatar
   ========================================================== */
router.put("/", verifyToken, upload.single("avatar"), async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;
    const userId = req.user.userId || req.user.id;

    if (!userId)
      return res.status(400).json({ message: "❌ Token không chứa userId!" });

    // ✅ Chuẩn bị dữ liệu cập nhật
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    // ✅ Nếu có file avatar → upload lên Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
      });
      updateData.avatar = result.secure_url;
    }

    // ✅ Hash mật khẩu nếu có thay đổi
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    // ✅ Không có gì để update
    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "❌ Không có dữ liệu để cập nhật!" });
    }

    // ✅ Cập nhật user trong DB
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      }).select("-password");

      if (!updatedUser)
        return res.status(404).json({ message: "❌ Không tìm thấy người dùng!" });

      // 🆕 Đảm bảo Cloudinary trả đúng URL mới, tránh ảnh cũ bị cache
      let avatarUrl = updatedUser.avatar;
      if (avatarUrl) {
        avatarUrl = `${avatarUrl}?v=${Date.now()}`;
      }

      // 🆕 Trả về JSON kèm timestamp
      res.json({
        message: "✅ Cập nhật thông tin & avatar thành công!",
        user: {
          ...updatedUser.toObject(),
          avatar: avatarUrl,
        },
      });
  } catch (err) {
    console.error("❌ Lỗi PUT /profile:", err);
    res.status(500).json({
      message: "Lỗi server khi cập nhật profile.",
      error: err.message,
    });
  }
});

module.exports = router;