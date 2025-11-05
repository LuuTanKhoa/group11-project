// ✅ src/components/Profile.jsx (đã khớp backend)
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://192.168.38.166:5000"; // ⚠️ đổi IP nếu backend thay đổi

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  // ✅ Lấy thông tin người dùng
  useEffect(() => {
    const fetchProfile = async () => {
      const token =
        localStorage.getItem("jwtToken") || localStorage.getItem("token");

      if (!token) {
        alert("⚠️ Bạn chưa đăng nhập!");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`${BACKEND_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data;
        setProfile(user);
      } catch (err) {
        console.error("❌ Lỗi tải profile:", err);
        if (err.response?.status === 403) {
          alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
          localStorage.removeItem("jwtToken");
          navigate("/login");
        } else if (err.response?.status === 404) {
          alert("Không tìm thấy người dùng!");
        } else {
          alert("Không thể tải thông tin hồ sơ!");
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  // ✅ Cập nhật thông tin người dùng
  const handleUpdate = async () => {
    const token =
      localStorage.getItem("jwtToken") || localStorage.getItem("token");

    if (!token) {
      alert("⚠️ Bạn chưa đăng nhập!");
      return;
    }

    const formData = new FormData();
    formData.append("name", profile.name || "");
    formData.append("phone", profile.phone || "");
    formData.append("address", profile.address || "");
    if (avatarFile) formData.append("avatar", avatarFile);

    try {
      const res = await axios.put(`${BACKEND_URL}/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Cập nhật thành công!");

      // 🆕 Làm mới avatar ngay lập tức, tránh cache
      const updatedUser = res.data.user;
      setProfile({
        ...updatedUser,
        avatar: updatedUser.avatar
          ? `${updatedUser.avatar}?v=${Date.now()}`
          : profile.avatar,
      });

      setEditMode(false);
      setAvatarFile(null);
      setPreview(null);
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật:", error);
      alert("Không thể cập nhật thông tin!");
    }
  };

  // ✅ Quay lại trang trước
  const handleBack = () => {
    navigate(-1);
  };

  // ✅ Xử lý chọn ảnh avatar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4"
        style={{
          maxWidth: "480px",
          width: "100%",
          borderRadius: "15px",
          border: "none",
        }}
      >
        <h3 className="text-center mb-2 fw-bold text-success">Hồ sơ cá nhân</h3>
        <p className="text-center text-muted mb-3">👤 Thông tin người dùng</p>

        {/* Ảnh đại diện */}
        <div className="text-center mb-4">
          <label className="position-relative d-inline-block">
            <img
              src={
                preview
                  ? preview
                  : profile.avatar
                  ? `${profile.avatar}?v=${Date.now()}`
                  : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="Avatar"
              className="rounded-circle border border-3 border-success shadow-sm"
              width="120"
              height="120"
              style={{ objectFit: "cover" }}
            />

            {editMode && (
              <input
                type="file"
                accept="image/*"
                className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            )}
          </label>
        </div>

        {/* Form thông tin */}
        <form>
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control bg-light"
              value={profile.email || ""}
              readOnly
              disabled
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Họ và tên</label>
            <input
              type="text"
              className="form-control"
              value={profile.name || ""}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              readOnly={!editMode}
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Số điện thoại</label>
            <input
              type="text"
              className="form-control"
              value={profile.phone || ""}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              readOnly={!editMode}
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Địa chỉ</label>
            <input
              type="text"
              className="form-control"
              value={profile.address || ""}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
              readOnly={!editMode}
            />
          </div>
        </form>

        {/* Nút hành động */}
        <div className="d-flex justify-content-between mt-4">
          {!editMode ? (
            <>
              <button
                onClick={() => setEditMode(true)}
                className="btn btn-warning w-50 me-2"
              >
                ✏️ Chỉnh sửa
              </button>
              <button onClick={handleBack} className="btn btn-secondary w-50">
                ⬅️ Quay lại
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleUpdate}
                className="btn btn-success w-50 me-2"
              >
                💾 Lưu
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setAvatarFile(null);
                  setPreview(null);
                }}
                className="btn btn-secondary w-50"
              >
                ❌ Hủy
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
