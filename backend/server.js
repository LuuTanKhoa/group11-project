// ===== Server khởi động backend =====
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());

/* ===================================
   🧩 Import routes
   =================================== */
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const userRoutes = require("./routes/user");
const extraRoutes = require("./routes/extra");

/* ===================================
   🔗 Sử dụng routes
   =================================== */
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/users", userRoutes);
app.use("/extra", extraRoutes);

console.log("✅ Đã nạp routes: auth, profile, users, extra!");

/* ===================================
   ⚙️ Kết nối MongoDB Atlas
   =================================== */
mongoose
  .connect(
    process.env.MONGO_URI ||
      "mongodb+srv://phucdatnguyen2505_db_user:123@cluster0.hta2207.mongodb.net/?appName=Cluster0"
  )
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* ===================================
   🚀 Các route cơ bản để test
   =================================== */
app.get("/test-backend", (req, res) => {
  res.send("✅ Backend đang hoạt động!");
});

app.get("/", (req, res) => {
  res.send("✅ Server is running");
});

// Ngăn lỗi favicon từ trình duyệt
app.get("/favicon.ico", (req, res) => res.status(204).end());

/* ===================================
   ⚠️ Xử lý route không tồn tại
   =================================== */
app.use((req, res) => {
  res.status(404).json({ message: "🚫 Route không tồn tại trên server." });
});

/* ===================================
   🟢 Chạy server
   =================================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server đang chạy tại: http://0.0.0.0:${PORT}`);
});
