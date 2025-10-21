// Mảng tạm để lưu danh sách người dùng
const users = [];

// [GET] /users - Lấy danh sách tất cả người dùng
const getUsers = (req, res) => {
  res.json(users);
};

// [POST] /users - Thêm người dùng mới
const addUser = (req, res) => {
  const user = req.body; // Lấy dữ liệu người dùng từ body
  users.push(user); // Thêm vào mảng users
  res.status(201).json({
    message: "User added successfully",
    data: user
  });
};

// Xuất (export) các hàm để dùng ở file khác
module.exports = { getUsers, addUser };
