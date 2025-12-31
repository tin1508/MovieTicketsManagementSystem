import axios from 'axios';

const API_SHOWTIMES_URL = 'http://localhost:8080/api/v1/showtimes';

export const getAvailableDateByMovie =(movieId) => {
    return axios.get(`${API_SHOWTIMES_URL}/dates/${movieId}`);
}

export const getShowtimesByMovieAndDate = (movieId, date) => {
    return axios.get(`${API_SHOWTIMES_URL}/detail/${movieId}`,
        {
            params: {
                date: date
            }
        }
    );
}

export const listShowtimes = () => axios.get(API_SHOWTIMES_URL);

export const createShowtimes = (showtime) => axios.post(API_SHOWTIMES_URL, showtime);

export const getShowtimeById = (showtimeId) => axios.get(`${API_SHOWTIMES_URL}/${showtimeId}`);

export const patchShowtime = (showtimeId, showtime) => axios.patch(`${API_SHOWTIMES_URL}/${showtimeId}`, showtime);

export const deleteShowtime = (showtimeId) => axios.delete(`${API_SHOWTIMES_URL}/${showtimeId}`);