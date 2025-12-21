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
          <FaMapMarkerAlt /> {cinema?.name} – Phòng {room?.name}
        </p>

        <p>
          <FaClock />{' '}
          {new Date(showtimes?.showDate).toLocaleDateString('vi-VN')} |{' '}
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
            {details.map((detail, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #333' }}>
                <td>{detail.showtimeSeat?.seat?.seatNumber}</td>
                <td>
                  {detail.showtimeSeat?.seat?.seatType?.name === 'COUPLE'
                    ? 'Ghế đôi'
                    : 'Ghế thường'}
                </td>
                <td align="right">{formatCurrency(detail.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default BookingInfo;
