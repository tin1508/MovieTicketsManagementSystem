import axios from './customize-axios';

export const getAllBanners = async () => {
    try {
        const response = await axios.get('/banners');
        
        return response.result || response; 
    } catch (error) {
        console.error('Lỗi khi tải danh sách banner:', error);
        throw error;
    }
};

/**
 * 2. Tạo Banner Mới (Yêu cầu Admin)
 * Gọi API: POST /api/v1/banners
 * @param {FormData} formData
 */
export const createBanner = async (formData) => {
    try {

        const response = await axios.post('/banners', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', 
            }
        });
        return response.result || response;
    } catch (error) {
        console.error('Lỗi khi tạo banner:', error);
        throw error;
    }
};


export const deleteBanner = async (id) => {
    try {
        const response = await axios.delete(`/banners/${id}`);
        return response.result || response;
    } catch (error) {
        console.error('Lỗi khi xóa banner:', error);
        throw error;
    }
};