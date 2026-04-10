import axios from 'axios';

const API_SEATTYPES_URL = 'http://localhost:8080/api/v1/seat_types';

export const listSeatTypes = () => axios.get(API_SEATTYPES_URL);

export const patchSeatTypes = (seatTypeId, seatType) => axios.patch(`${API_SEATTYPES_URL}/${seatTypeId}`, seatType);
export const getSeatTypeById = (seatTypeId) => axios.get(`${API_SEATTYPES_URL}/${seatTypeId}`);