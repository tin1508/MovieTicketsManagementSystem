import axios from 'axios';

const API_BASE = "http://localhost:8080/api/v1";

const getAuthToken = () => localStorage.getItem("accessToken");

const getAuthHeaders = () => {
    const token = getAuthToken();
    if (!token) throw new Error('Chưa đăng nhập.');
    return { 'Authorization': `Bearer ${token}` };
};

/**
 * Lấy tất cả thống kê cơ bản (Movies + Users)
 * GET /api/v1/statistics
 */
export const getAllStats = async () => {
    try {
        const response = await axios.get(`${API_BASE}/statistics`, {
            headers: getAuthHeaders()
        });
        return response.data.result; // Trả về { movies: {...}, users: {...} }
    } catch (error) {
        console.error("Lỗi lấy thống kê:", error);
        throw error;
    }
};

/**
 * Lấy thống kê phim theo tháng (để vẽ biểu đồ)
 * GET /api/v1/statistics/movies/by-month
 */
export const getMoviesByMonth = async () => {
    try {
        const response = await axios.get(`${API_BASE}/statistics/movies/by-month`, {
            headers: getAuthHeaders()
        });
        return response.data.result; // Trả về Map { "JANUARY": 5, ... }
    } catch (error) {
        console.error("Lỗi lấy thống kê phim theo tháng:", error);
        throw error;
    }
};

/**
 * Lấy thống kê user theo tháng (để vẽ biểu đồ)
 * GET /api/v1/statistics/users/by-month
 */
export const getUsersByMonth = async () => {
    try {
        const response = await axios.get(`${API_BASE}/statistics/users/by-month`, {
            headers: getAuthHeaders()
        });
        return response.data.result; // Trả về Map { "JANUARY": 10, ... }
    } catch (error) {
        console.error("Lỗi lấy thống kê user theo tháng:", error);
        throw error;
    }
};