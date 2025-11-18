// import axios from 'axios';

// const API_URL = "http://localhost:8080/api/v1"; 

// const axiosInstance = axios.create({
//   baseURL: API_URL,
//   timeout: 10000, // 10-second timeout
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // --- Request Interceptor (Gửi token lên) ---
// // Tự động gắn token vào MỖI request
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // --- Response Interceptor (Xử lý lỗi 401) ---
// // Chỗ này quan trọng nhất để xử lý lỗi 401
// axiosInstance.interceptors.response.use(
//   (response) => {
//     // Bất kỳ status code nào nằm trong 2xx đều vào đây
//     return response;
//   },
//   (error) => {
//     // Bất kỳ status code nào ngoài 2xx đều vào đây
//     if (error.response && error.response.status === 401) {
//       console.error("TOKEN HẾT HẠN HOẶC KHÔNG HỢP LỆ. ĐĂNG XUẤT...");
      
//       // Xóa token hỏng
//       localStorage.removeItem('accessToken'); 
//       // (Bạn cũng có thể xóa thông tin user trong Redux/Context tại đây)

//       // Chuyển hướng người dùng về trang đăng nhập
//       // Dùng window.location vì nó nằm ngoài React Router
//       window.location.href = '/login'; 
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;