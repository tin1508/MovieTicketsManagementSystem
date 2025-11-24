import axios from 'axios';
// Hoặc import 'api' nếu bạn có file axios instance đã cấu hình sẵn token
// import axiosInstance from '.././api/axiosInstance'; 

// TODO: Đổi URL này thành URL API backend của bạn
const API_URL = "http://localhost:8080/api/v1"; 

// Hàm lấy token (giả sử bạn lưu token trong localStorage)
const getAuthToken = () => {
    return localStorage.getItem('accessToken');
};

const getAuthHeaders = () => {
    const token = getAuthToken();
    if (!token) {
        // Ném lỗi sớm nếu không có token (cho các hàm Admin)
        throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
    }
    return { 'Authorization': `Bearer ${token}` };
};

export const getAllUsers = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
        params: { page, size },
        headers: getAuthHeaders(), // <-- Dùng hàm headers đã sửa
    });

    // 5. SỬA LỖI LOGIC: Dựa trên log (10:39 PM) của bạn,
    // API trả về { result: [...] } (một MẢNG)
    if (response.data && Array.isArray(response.data.result)) {
        return response.data.result;
    }
    
    // Phòng hờ nếu backend trả về Page (có content)
    if (response.data && response.data.content) {
        return response.data;
    }

    return response.data; // Fallback
  } catch (error) {
    console.error("Get all users failed:", error.response?.data || error.message);
    throw error;
  }
};


// Cập nhật vai trò/trạng thái người dùng
export const updateUser = async (userId, updateData) => {
   try {
     const response = await axios.put(`${API_URL}/users/${userId}`, updateData) 
      headers: getAuthHeaders() // <-- Dùng hàm headers đã sửa
     return response.data;
   } catch (error) {
     console.error(`Lỗi khi cập nhật người dùng ${userId}:`, error);
     throw error;
   }
};

// Xóa người dùng
export const deleteUser = async (userId) => {
   try {
      const response = await axios.delete(`${API_URL}/users/${userId}`, {
      headers: getAuthHeaders() // <-- Dùng hàm headers đã sửa
     });
     return response.data;
   } catch (error) {
     console.error(`Lỗi khi xóa người dùng ${userId}:`, error);
     throw error;
   }
};

export const getMyProfile = async () => {
   try {
      const response = await axios.get(`${API_URL}/users/myInfo`, {
         headers: getAuthHeaders() 
      });
     return response.data.result || response.data;
   } catch (error) {
     console.error('Lỗi khi lấy thông tin cá nhân:', error);
     throw error;
   }
};

export const updateMyProfile = async (profileData) => {
   try {
      const response = await axios.put(`${API_URL}/users/myInfo`, profileData, {
        headers: getAuthHeaders()
      });
     return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin cá nhân:', error);
      throw error;
    }
};

export const changePassword = async (oldPassword, newPassword) => {
    try {
        const response = await axios.put(`${API_URL}/users/change-password`, 
            { 
                // Tên trường phải khớp 100% với DTO ChangePasswordRequest.java
                oldPassword: oldPassword, 
                newPassword: newPassword,
                
                // DTO yêu cầu 'confirmPassword' không được để trống (@NotBlank)
                // Vì frontend đã kiểm tra trùng khớp rồi, ta gửi luôn newPassword vào đây
                confirmPassword: newPassword 
            }, 
            {
                headers: getAuthHeaders() // Gửi kèm token
            }
        );
        return response.data;
    } catch (error) {
        console.error('Lỗi khi đổi mật khẩu:', error.response?.data || error.message);
        throw error;
    }
};

// HÀM MỚI: Lấy lịch sử đặt vé
// export const getMyBookings = async () => {
//     const token = getAuthToken();
//     if (!token) throw new Error('Chưa đăng nhập.');

//     try {
//         const response = await axios.get(`${API_URL}/me/bookings`, {
//             headers: { 'Authorization': `Bearer ${token}` }
//         });
        
//         // Giả sử backend trả về { result: [...] }
//         return response.data.result || response.data;
//     } catch (error) {
//         console.error('Lỗi khi tải lịch sử đặt vé:', error);
//         throw error;
//     }
// };
