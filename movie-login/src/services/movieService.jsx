import axios from 'axios';
import * as genreService from './genreService';
const API_URL = 'http://localhost:8080/api/v1/movies';

export const getAllMovies = async (page = 0, size = 10, filters = {}) => {
    // 1. (Giữ nguyên) Xây dựng params
    const { keyword, movieStatus, genreIds } = filters;
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);

    if (keyword) {
        params.append('keyword', keyword);
    }
    if (movieStatus) {
        params.append('movieStatus', movieStatus); 
    }
    if (genreIds && genreIds.length > 0) {
        genreIds.forEach(id => params.append('genreIds', id));
    }

    try {
        // 2. (Giữ nguyên) Cấu hình gọi API
        const response = await axios.get(`${API_URL}?${params.toString()}`, {
            headers: {
                'Authorization': null 
            }
        }); 
        // 3. (SỬA LỖI) Unpack dữ liệu trước khi trả về
        if (response.data && response.data.result) {
            // Trả về object Page { content: [...], totalPages: X }
            return response.data.result; 
        } else {
            // Fallback nếu API trả về { content: [...] } trực tiếp
            if (response.data && response.data.content) {
                return response.data;
            }
            // Nếu không, ném lỗi
            throw new Error('Cấu trúc API movies không hợp lệ');
        }
    
    } catch (error) {
        console.error('Lỗi khi tải danh sách phim:', error);
        throw error;
    }
};

export const uploadPoster = async (movieId, file) => {
    // 1. Tạo đối tượng FormData
    const formData = new FormData();
    formData.append('file', file); // 'file' phải khớp với @RequestParam("file") của backend

    try {
        // 2. Gọi API POST đến /movies/{id}/poster
        const response = await axios.post(`${API_URL}/${movieId}/poster`, formData, {
            headers: {
                // 3. Quan trọng: Báo cho axios đây là dữ liệu 'multipart/form-data'
                'Content-Type': 'multipart/form-data', 
            }
        });
        
        // Trả về dữ liệu (ApiResponse { result: { url: "..." } })
        return response.data;

    } catch (error) {
        console.error('Lỗi khi tải poster:', error.response?.data || error);
        throw error.response?.data || error;
    }
};


export const getMovieById = async (movieId) => {
    try {
        const response = await axios.get(`${API_URL}/${movieId}`);
        if (response.data && response.data.result){
            return response.data.result;
        } else {
            return response.data;
        }
    }
    catch (error) {
        console.error(`Lỗi khi tải chi tiết phim ${id}:`, error);
        throw error;
    }
};

export const createMovie = async (movieData) => {
    try {
        const response = await axios.post(API_URL, movieData);
        return response.data;
    } catch (error) {
        console.error('Error creating movie:', error);
        throw error;
    }
};

export const updateMovie = async (id, movieData) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, movieData);
        return response.data;
    } catch (error) {
        console.error(`Error updating movie with id ${id}:`, error);
        throw error;
    }
};

export const deleteMovie = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting movie with id ${id}:`, error);
        throw error;
    }
}