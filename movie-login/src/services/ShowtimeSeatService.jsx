import axios from 'axios';

const API_SHOWTIMESEATS_URL = 'http://localhost:8080/api/v1/showtimeSeat';

const getToken = () => localStorage.getItem('accessToken');
const getGuestId = () => {
  let id = localStorage.getItem("guestId");
  if(!id){
    id = crypto.randomUUID();
    localStorage.setItem("guestId", id);
  }
  return id;
}
export const fetchSeats = (showtimeId) =>
  axios.get(`${API_SHOWTIMESEATS_URL}/${showtimeId}`);
export const holdSeats = (showtimeId, seatIds) => {
  const token = getToken();
  const guestId = getGuestId(); 
  const headers = {
    'X-GUEST_ID': guestId
  }// gửi header nếu guest
  if(token){
    headers['Authorization'] = `Bearer ${token}`;
  }
  return axios.post(
    `${API_SHOWTIMESEATS_URL}/${showtimeId}/hold`,
    { seatIds }, // backend dùng SecurityUtils.getUserIdOrNull() + guestId header
    { headers }
  );
};

export const releaseSeats = (showtimeId, seatIds) => {
  const token = getToken();
  const guestId = getGuestId();
  const headers = {
    'X-GUEST_ID': guestId
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return axios.post(
    `${API_SHOWTIMESEATS_URL}/${showtimeId}/release`,
    { seatIds },
    { headers }
  );
};

export const releaseSeatsKeepAlive = (showtimeId, seatIds) => {
  const token = getToken();
  const guestId = getGuestId();
  
  // URL đầy đủ
  const url = `${API_SHOWTIMESEATS_URL}/${showtimeId}/release`;

  // Chuẩn bị Headers thủ công (vì fetch không tự lấy như axios interceptor)
  const headers = {
    'Content-Type': 'application/json', // Bắt buộc với fetch
    'X-GUEST_ID': guestId
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Gọi fetch với keepalive: true
  // Lưu ý: Không cần return vì thường hàm này gọi khi component unmount
  fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ seatIds }), // Fetch yêu cầu body là string
    keepalive: true // <--- Cờ quan trọng để sống sót khi đóng Tab
  }).catch(err => console.error("Lỗi nhả ghế background (KeepAlive):", err));
};