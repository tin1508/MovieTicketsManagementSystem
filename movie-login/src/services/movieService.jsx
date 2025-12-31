import axios from './customize-axios';

export const getAllMovies = async (page = 0, size = 10, filters = {}) => {
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
        const response = await axios.get('/movies', { params });
        return response.result || response; 
    } catch (error) {
        console.error('Lỗi khi tải danh sách phim:', error);
        throw error;
    }
};

export const uploadPoster = async (movieId, file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`/movies/${movieId}/poster`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', 
            }
        });
        return response.result || response;
    } catch (error) {
        console.error('Lỗi khi tải poster:', error);
        throw error;
    }
};

export const getMovieById = async (movieId) => {
    try {
        const response = await axios.get(`/movies/${movieId}`);
        return response.result || response;
    }
    catch (error) {
        console.error(`Lỗi khi tải chi tiết phim ${movieId}:`, error);
        throw error;
    }
};

export const createMovie = async (movieData) => {
    try {
        const response = await axios.post('/movies', movieData);
        return response.result || response;
    } catch (error) {
        console.error('Error creating movie:', error);
        throw error;
    }
};

export const updateMovie = async (id, movieData) => {
    try {
        const response = await axios.put(`/movies/${id}`, movieData);
        return response.result || response;
    } catch (error) {
        console.error(`Error updating movie with id ${id}:`, error);
        throw error;
    }
};

export const deleteMovie = async (id) => {
    try {
        const response = await axios.delete(`/movies/${id}`);
        return response;
    } catch (error) {
        console.error(`Error deleting movie with id ${id}:`, error);
        throw error;
    }
};
export const listMovies = async () => {
    try {
        // Gọi thẳng endpoint '/movies' (hoặc '/movies/all' tùy backend)
        // Vì axios đã được cấu hình base URL rồi nên không cần biến API_URL nữa
        const response = await axios.get('/movies'); 
        
        // Trả về dữ liệu đã bóc tách (response.result) để component dễ dùng
        return response.result || response; 
    } catch (error) {
        console.error('Lỗi khi tải danh sách phim (dropdown):', error);
        throw error;
    }
};