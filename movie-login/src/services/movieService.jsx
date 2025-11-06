import axios from 'axios';
import * as genreService from './genreService';
const API_URL = 'http://localhost:8080/api/v1/movies';

export const getAllMovies = async (page = 0, size = 10, filters = {}) => {
    const { keyword, movieStatus, genreIds } = filters; // Lấy ra mảng genreIds

    const params = new URLSearchParams();
    params.append('page', page);
    params.append('size', size);

    if (keyword) {
        params.append('keyword', keyword);
    }
    if (movieStatus) {
        params.append('movieStatus', movieStatus);
    }

    // THAY ĐỔI QUAN TRỌNG LÀ Ở ĐÂY
    if (genreIds && genreIds.length > 0) {
        // Thay vì: params.append('genreIds', genreIds.join(','));
        // Dùng:
        genreIds.forEach(id => params.append('genreIds', id));
        // Điều này sẽ tạo ra URL: ...&genreIds=4&genreIds=7
    }

    try {
        // Dùng API_URL của bạn
        const response = await axios.get(`${API_URL}?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Lỗi khi tải danh sách phim:', error);
        throw error;
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