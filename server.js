const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(express.json());

// --- Kết nối MongoDB Atlas ---
mongoose.connect(
  'mongodb+srv://phucdatnguyen2505_db_user:group11@cluster0.hta2207.mongodb.net/groupDB',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(() => console.log('✅ Đã kết nối MongoDB Atlas'))
.catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// --- Model User ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// --- API Routes ---

// GET tất cả user
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi khi lấy danh sách user', error: err.message });
  }
});

// GET user theo ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: '❌ User không tồn tại' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: '❌ Lỗi khi lấy user', error: err.message });
  }
});

// POST – Thêm user mới
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ message: '❌ Name và email bắt buộc' });

    const newUser = new User({ name, email });
    await newUser.save();

    res.status(201).json({ message: '✅ Thêm user thành công!', user: newUser });
  } catch (err) {
    res.status(400).json({ message: '❌ Thêm user thất bại', error: err.message });
  }
});

// PUT – Cập nhật user
app.put('/users/:id', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: '❌ User không tồn tại' });

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();
    res.json({ message: '✅ Cập nhật user thành công!', user });
  } catch (err) {
    res.status(400).json({ message: '❌ Cập nhật thất bại', error: err.message });
  }
});

// DELETE – Xóa user
app.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: '❌ User không tồn tại' });

    await user.deleteOne();
    res.json({ message: '✅ Xóa user thành công!' });
  } catch (err) {
    res.status(500).json({ message: '❌ Xóa user thất bại', error: err.message });
  }
});

// --- Khởi chạy server ---
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server chạy tại http://localhost:${PORT}`));
