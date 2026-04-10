import axios from 'axios';

const API_ROOMS_URL = 'http://localhost:8080/api/v1/rooms';

export const listRooms = () => axios.get(API_ROOMS_URL);
export const createRoom = (room) => axios.post(API_ROOMS_URL, room);
export const getRoomById = (roomId) => axios.get(`${API_ROOMS_URL}/${roomId}`);
export const patchRoom = (roomId, room) => axios.patch(`${API_ROOMS_URL}/${roomId}`, room);
export const deleteRoom = (roomId) => axios.delete(`${API_ROOMS_URL}/${roomId}`);