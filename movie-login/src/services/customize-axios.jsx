import axios from "axios";
import Swal from "sweetalert2"; 

const instance = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
});

// 1. Request Interceptor: Gắn Token vào Header
instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Biến cờ để tránh hiện alert nhiều lần
let isAlertShown = false; 

// 2. Response Interceptor: Xử lý Refresh Token và Lỗi
instance.interceptors.response.use(
    function (response) {
        // Trả về data trực tiếp cho gọn
        return response.data ? response.data : response; 
    }, 
    async function (error) {
        const originalRequest = error.config;
        const status = error.response ? error.response.status : 500;
        
        console.log("Interceptor bắt được lỗi status:", status);

        // --- TRƯỜNG HỢP 1: Token hết hạn (401) và chưa từng thử Refresh ---
        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Đánh dấu đã thử để tránh vòng lặp vô tận

            try {
                // Lấy Refresh Token từ LocalStorage
                const refreshToken = localStorage.getItem("refreshToken"); // Đảm bảo bạn đã lưu cái này lúc login

                if (!refreshToken) {
                    throw new Error("Không tìm thấy Refresh Token");
                }

                // Gọi API xin cấp lại Token mới
                // Lưu ý: Dùng axios gốc để tránh dính interceptor của instance này
                const response = await axios.post('http://localhost:8080/api/v1/auth/refresh-token', {
                    refreshToken: refreshToken
                });

                // Giả sử API trả về: { accessToken: '...', refreshToken: '...' }
                // Bạn cần sửa lại key bên dưới cho đúng với response của server bạn
                const { accessToken, refreshToken: newRefreshToken } = response.data;

                // 1. Lưu Token mới vào LocalStorage
                localStorage.setItem("accessToken", accessToken);
                if (newRefreshToken) {
                    localStorage.setItem("refreshToken", newRefreshToken);
                }

                // 2. Gắn Token mới vào header của request cũ đang bị lỗi
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                // 3. Thực hiện lại request cũ
                return instance(originalRequest);

            } catch (refreshError) {
                // Nếu Refresh cũng thất bại (Hết hạn cả Refresh Token hoặc bị khóa)
                console.error("Refresh Token thất bại:", refreshError);
                // Chuyển xuống hàm xử lý logout bên dưới
                handleSessionExpired();
                return Promise.reject(refreshError);
            }
        }

        // --- TRƯỜNG HỢP 2: Lỗi 403 (Không đủ quyền) hoặc Refresh thất bại ---
        if (status === 403 || (status === 401 && originalRequest._retry)) {
            handleSessionExpired();
        }

        return Promise.reject(error);
    }
);

// Hàm phụ: Xử lý thông báo và Logout
const handleSessionExpired = () => {
    if (isAlertShown || window.location.pathname === '/login') return;

    isAlertShown = true;

    Swal.fire({
        title: 'Phiên đăng nhập hết hạn',
        text: 'Tài khoản của bạn đã đăng nhập ở nơi khác hoặc phiên làm việc đã kết thúc. Vui lòng đăng nhập lại!',
        icon: 'warning',
        confirmButtonText: 'Đồng ý',
        confirmButtonColor: '#ffc107',
        allowOutsideClick: false, 
        allowEscapeKey: false,
        background: '#1a1a1a', 
        color: '#ffffff'    
    }).then((result) => {
        if (result.isConfirmed) {
            // Xóa sạch Token
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user"); // Xóa thông tin user nếu có
            
            isAlertShown = false;
            window.location.href = "/login";
        }
    });
};

export default instance;