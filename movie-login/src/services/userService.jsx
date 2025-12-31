import axios from './customize-axios'; 


export const getAllUsers = async (page = 0, size = 10, search = '') => {
  try {
    const response = await axios.get('/users', {
        params: { 
            page, 
            size,
            search 
        }
    });
    return response; 
    
  } catch (error) {
    console.error("Get all users failed:", error);
    throw error;
  }
};

export const updateUser = async (userId, updateData) => {
    try {
        const response = await axios.put(`/users/${userId}`, updateData);
        return response;
    } catch (error) {
        console.error(`Lỗi khi cập nhật người dùng ${userId}:`, error);
        throw error;
    }
};

export const toggleUserStatus = async (userId) => {
    try {
        const response = await axios.put(`/users/${userId}/status`, {}); 
        return response;
    } catch (error) {
        console.error(`Lỗi khi thay đổi trạng thái user ${userId}:`, error);
        throw error;
    }
};

export const deleteUser = async (userId) => {
   try {
      const response = await axios.delete(`/users/${userId}`);
      return response;
   } catch (error) {
      console.error(`Lỗi khi xóa người dùng ${userId}:`, error);
      throw error;
   }
};

export const getMyProfile = async () => {
   try {
      const response = await axios.get('/users/myInfo');
      return response.result || response;
   } catch (error) {
      console.error('Lỗi khi lấy thông tin cá nhân:', error);
      throw error;
   }
};

export const updateMyProfile = async (profileData) => {
   try {
      const response = await axios.put('/users/myInfo', profileData);
      return response;
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin cá nhân:', error);
      throw error;
   }
};

export const changePassword = async (oldPassword, newPassword) => {
    try {
        const response = await axios.put('/users/change-password', 
            { 
                oldPassword: oldPassword, 
                newPassword: newPassword,
                confirmPassword: newPassword 
            }
        );
        return response;
    } catch (error) {
        console.error('Lỗi khi đổi mật khẩu:', error);
        throw error;
    }
};