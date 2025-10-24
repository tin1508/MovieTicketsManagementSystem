import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/movies';

export const getAllMovies = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
};

export const getMovieById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    }
    catch (error) {
        console.error(`Error fetching movie with id ${id}:`, error);
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