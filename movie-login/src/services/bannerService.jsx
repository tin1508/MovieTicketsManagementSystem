import axios from 'axios';

// URL gốc của API (giống userService)
const API_BASE = "http://localhost:8080/api/v1"; 

// Hàm lấy token từ localStorage
const getAuthToken = () => {
    return localStorage.getItem("accessToken");
};

// Hàm tạo Header có token (cho các API Admin)
const getAuthHeaders = () => {
    const token = getAuthToken();
    if (!token) {
        throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
    }
    return { 
        'Authorization': `Bearer ${token}`,
        // Không cần Content-Type ở đây vì axios tự động set cho FormData
    };
};

/**
 * 1. Lấy danh sách tất cả Banner (Công khai - Public)
 * Gọi API: GET /api/v1/banners
 */
export const getAllBanners = async () => {
    try {
        // API này công khai, không cần token
        const response = await axios.get(`${API_BASE}/banners`);
        
        // Backend trả về ApiResponse { result: [...] }
        return response.data.result || []; 
    } catch (error) {
        console.error('Lỗi khi tải danh sách banner:', error);
        throw error;
    }
};

/**
 * 2. Tạo Banner Mới (Yêu cầu Admin)
 * Gọi API: POST /api/v1/admin/banners
 * @param {FormData} formData - Chứa file ảnh và các thông tin (title, targetUrl...)
 */
export const createBanner = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE}/banners`, formData, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'multipart/form-data', // Quan trọng để gửi file
            }
        });
        return response.data.result;
    } catch (error) {
        console.error('Lỗi khi tạo banner:', error.response?.data || error.message);
        throw error;
    }
};

/**
 * 3. Xóa Banner (Yêu cầu Admin)
 * Gọi API: DELETE /api/v1/admin/banners/{id}
 */
export const deleteBanner = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE}/banners/${id}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi xóa banner:', error);
        throw error;
    }
};