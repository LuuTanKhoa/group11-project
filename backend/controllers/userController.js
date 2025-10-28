const User = require('../models/User');

// GET /users → Lấy danh sách user
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /users → Thêm user mới
const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }
        const newUser = new User({ name, email });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// PUT /users/:id → Sửa user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// DELETE /users/:id → Xóa user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };