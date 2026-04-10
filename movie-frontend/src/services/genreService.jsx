import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/genres";

export const getAllGenres = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách thể loại:", error);
        throw error;
    }
};