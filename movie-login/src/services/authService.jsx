import axios from './customize-axios';


export const loginUser = async (username, password) => {
    try {
        const res = await axios.post("/auth/token", { username, password });

        const data = res.result || res; 

        if (data.token) {
            localStorage.setItem("accessToken", data.token);
        } else if (data.accessToken) {
            localStorage.setItem("accessToken", data.accessToken);
        }

        return data;
    } catch (error) {
        throw error;
    }
};


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


export const logoutUser = () => {
    localStorage.removeItem("accessToken");
};


export const forgotPassword = (email) => {
    // 1. Bỏ biến API_URL đi (vì chưa khai báo)
    // 2. Dùng đường dẫn tương đối (giống loginUser)
    // 3. Đảm bảo axios từ './customize-axios' đã có baseURL (ví dụ: http://localhost:8080/api/v1)
    return axios.post("/auth/forgot-password", null, {
        params: { email } 
    });
};

export const resetPassword = (token, newPassword) => {
    // Tương tự, bỏ API_URL
    return axios.post("/auth/reset-password", { token, newPassword });
};