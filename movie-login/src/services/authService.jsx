import axios from 'axios';

// SỬA LỖI URL: Thêm /api/v1 vào trước /auth
const API_AUTH_URL = "http://localhost:8080/api/v1/auth"; 

/**
 * Gọi API để đăng nhập
 */
export const loginUser = async (username, password) => {
  try {
    const res = await axios.post(`${API_AUTH_URL}/token`, { username, password });

    const payload = res.data?.result || res.data;

    // LƯU TOKEN VÀO LOCAL STORAGE
    localStorage.setItem("token", payload.accessToken);

    return payload;

  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error.response?.data || error.message);
    throw error.response?.data || new Error('Lỗi đăng nhập');
  }
};

/**
 * Gọi API để đăng ký
 * (API này cũng phải có /api/v1)
 */
export const registerUser = async (userData) => {
    try {
        // Giả sử API đăng ký nằm ở /api/v1/users
        const response = await axios.post("http://localhost:8080/api/v1/users", userData);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi đăng ký:', error.response?.data || error.message);
        throw error.response?.data || new Error('Lỗi đăng ký');
    }
};

/**
 * Gọi API Logout
 */
export const logoutUser = async (token) => {
    if (!token) return;
    try {
        // Gọi đúng endpoint: /api/v1/auth/logout
        await axios.post(`${API_AUTH_URL}/logout`, {
            token: token
        });
    } catch (error) {
        console.error('Lỗi khi logout:', error.response?.data || error.message);
    }
};