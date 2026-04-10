import axios from './customize-axios';

/**
 * Lấy tất cả thống kê cơ bản (Movies + Users)
 * GET /api/v1/statistics
 */
export const getAllStats = async () => {
    try {
        const response = await axios.get('/statistics');
        return response.result || response; 
    } catch (error) {
        console.error("Lỗi lấy thống kê:", error);
        throw error;
    }
};

/**
 * Lấy thống kê phim theo tháng (để vẽ biểu đồ)
 * GET /api/v1/statistics/movies/by-month
 */
export const getMoviesByMonth = async () => {
    try {
        const response = await axios.get('/statistics/movies/by-month');
        return response.result || response; 
    } catch (error) {
        console.error("Lỗi lấy thống kê phim theo tháng:", error);
        throw error;
    }
};

/**
 * Lấy thống kê user theo tháng (để vẽ biểu đồ)
 * GET /api/v1/statistics/users/by-month
 */
export const getUsersByMonth = async () => {
    try {
        const response = await axios.get('/statistics/users/by-month');
        return response.result || response; 
    } catch (error) {
        console.error("Lỗi lấy thống kê user theo tháng:", error);
        throw error;
    }
};

export const getDailyRevenueStats = async () => {
    try {
        const response = await axios.get('/statistics/daily-revenue');
        // Sửa: Dùng logic giống hàm getAllMovieStats
        return response.result || response; 
    } catch (error) {
        console.error("Lỗi lấy doanh thu:", error);
        return [];
    }
};

export const getTopMoviesStats = async () => {
    try {
        const response = await axios.get('/statistics/top-movies');
        // Sửa: Dùng logic giống hàm getAllMovieStats
        return response.result || response;
    } catch (error) {
        console.error("Lỗi lấy top phim:", error);
        return [];
    }
};

export const getAllMovieStats = async () => {
    try {
        const response = await axios.get('/statistics/movies-revenue');
        return response.result || response;
    } catch (error) {
        console.error("Lỗi lấy chi tiết phim:", error);
        return [];
    }
};