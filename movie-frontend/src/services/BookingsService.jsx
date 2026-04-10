import axios from 'axios';

const API_BOOKINGS_URL = 'http://localhost:8080/api/v1/bookings';

export const listBookings = () => axios.get(API_BOOKINGS_URL);
export const createBooking = async (bookingData) => {
    const token = localStorage.getItem('accessToken');
    return axios.post(`${API_BOOKINGS_URL}`, bookingData, {
        headers: { Authorization: `Bearer ${token}` }
    });
}


export const getMyBookings = () => {
    const token = localStorage.getItem('accessToken');
    return axios.get(`${API_BOOKINGS_URL}/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
export const cancelBooking = (id) => axios.put(`${API_BOOKINGS_URL}/${id}/cancel-booking`);