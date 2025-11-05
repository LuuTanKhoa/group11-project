import axios from "axios";

const BACKEND_URL = "http://192.168.x.x:5000"; // ⚠️ đổi theo IP backend

const api = axios.create({
  baseURL: BACKEND_URL,
});

// ✅ Thêm accessToken vào mỗi request
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// ✅ Tự động refresh token nếu bị 403 (token hết hạn)
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        window.location.href = "/login";
        return Promise.reject(err);
      }

      try {
        const res = await axios.post(`${BACKEND_URL}/auth/refresh`, { refreshToken });
        localStorage.setItem("accessToken", res.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(originalRequest);
      } catch (error) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
