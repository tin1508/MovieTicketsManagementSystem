import React from 'react';
import { 
  FaMapMarkerAlt, 
  FaFilm, 
  FaClock, 
  FaChair, 
  FaTicketAlt 
} from 'react-icons/fa';

const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const getSeatTypeLabel = (type) => {
  const typeMap = {
    'NORMAL': 'Ghế thường',
    'COUPLE': 'Ghế đôi',
    'VIP': 'Ghế VIP'
  };
  return typeMap[type] || 'Ghế thường';
}
const BookingInfo = ({ booking }) => {
  if (!booking) return null;

  const showtimes = booking.showtimes;
  const room = showtimes?.room;
  const cinema = room?.cinema;
  const details = booking.bookingDetails || [];

  return (
    <div className="bill-summary-card">

      {/* ===== HEADER ===== */}
      <div className="bill-header">
        <FaTicketAlt className="bill-icon" />
        <h2>Thông tin đặt vé</h2>
      </div>

      {/* ===== BOOKING CODE ===== */}
      <div className="booking-code-section">
        <span>Mã đặt vé:</span>
        <strong style={{ marginLeft: 8 }}>{booking.bookingCode}</strong>
      </div>

      {/* ===== MOVIE INFO ===== */}
      <div className="movie-info-summary">
        <h3>
          <FaFilm /> {showtimes?.movie?.title}
        </h3>

        <p>
          <FaMapMarkerAlt /> {cinema?.name} - Phòng {room?.name}
        </p>

        <p>
          <FaClock />{' '}
          {new Date(showtimes?.showtimesDate).toLocaleDateString('vi-VN')} |{' '}
          {showtimes?.startTime}
        </p>
      </div>

      {/* ===== SEAT TABLE ===== */}
      <div className="seat-details-list">
        <h4><FaChair /> Ghế đã chọn</h4>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #555' }}>
              <th align="left">Ghế</th>
              <th align="left">Loại</th>
              <th align="right">Giá</th>
            </tr>
          </thead>

          <tbody>
            {details.map((detail, index) => {
              const nameOfSeat = detail.showtimeSeat?.seat?.seatName;
              const typeName = detail.showtimeSeat?.seat?.seatType.name;
              const price = detail.price;
              return (
                  <tr key={index} style={{ borderBottom: '1px solid #333' }}>
                    {/* Tên ghế (VD: A1, B2) */}
                    <td>{nameOfSeat}</td>
                    
                    {/* Loại ghế (Map từ NORMAL/VIP/COUPLE -> Tiếng Việt) */}
                    <td>{getSeatTypeLabel(typeName)}</td>

                    {/* Giá tiền */}
                    <td align="right">{formatCurrency(price)}</td>
                  </tr>
                );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default BookingInfo;
