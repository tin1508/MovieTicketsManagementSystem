import React, { useState, useEffect } from 'react';
import { getMyBookings } from '../../services/BookingsService';
import '../../styles/ShowtimesListPage.css';

const MyBookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await getMyBookings();
                const data = response.data.result || response.data || [];
                
                // --- SỬA Ở ĐÂY: LỌC TRẠNG THÁI CONFIRMED ---
                let list = Array.isArray(data) ? data : [];

                // Chỉ giữ lại những vé có status là 'CONFIRMED'
                // (Bạn kiểm tra lại DB xem lưu là 'CONFIRMED', 'SUCCESS' hay 'PAID' để sửa string này cho khớp nhé)
                const confirmedList = list.filter(booking => booking.status === 'CONFIRMED');

                setBookings(confirmedList.reverse()); 
                // --------------------------------------------

            } catch (err) {
                console.error("Lỗi:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    // Hàm format ngày giờ cho gọn đẹp
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit', year: 'numeric'});
    };

    // Hàm format giờ (cắt giây nếu cần)
    const formatTime = (timeString) => {
        if (!timeString) return '';
        return timeString.slice(0, 5); // Ví dụ: 19:30:00 -> 19:30
    };

    if (isLoading) return <p style={{color:'white', textAlign:'center', marginTop:'20px'}}>Đang tải...</p>;

    return (
        <div className="profile-box">
            <div className="profile-box-header"><h3>Lịch Sử Đặt Vé</h3></div>

            {bookings.length === 0 ? (
                <p style={{textAlign: 'center', color: '#aaa', padding: '20px'}}>Bạn chưa đặt vé nào.</p>
            ) : (
                <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
                    {bookings.map(booking => (
                        <div key={booking.id} className="booking-card" style={{background:'rgba(255,255,255,0.05)', padding:'20px', borderRadius:'10px'}}>
                            
                            {/* Header đơn hàng */}
                            <div style={{display:'flex', justifyContent:'space-between', borderBottom:'1px solid #444', paddingBottom:'15px', marginBottom:'15px'}}>
                                <span style={{color:'#F4F169', fontWeight:'bold', fontSize:'1.1rem'}}>Mã đơn: {booking.bookingCode}</span>
                                <div>
                                    <span style={{color:'#ccc', marginRight:'15px', fontSize:'0.9rem'}}>
                                        Ngày đặt: {formatDate(booking.bookingDate)}
                                    </span>
                                    {/* Class status-badge sẽ giúp tô màu xanh/đỏ tùy CSS của bạn */}
                                    <span className={`status-badge ${booking.status}`}>{booking.status}</span>
                                </div>
                            </div>

                            {/* Bảng chi tiết vé - 5 Cột */}
                            <table className="ticket-detail-table" style={{width:'100%', fontSize:'0.95rem', tableLayout:'fixed', borderCollapse:'collapse'}}>
                                <thead>
                                    <tr style={{color:'#aaa', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                                        <th style={{textAlign:'left', width:'35%', paddingBottom:'10px'}}>Phim</th>
                                        <th style={{textAlign:'center', width:'20%', paddingBottom:'10px'}}>Suất chiếu</th>
                                        <th style={{textAlign:'center', width:'15%', paddingBottom:'10px'}}>Phòng</th>
                                        <th style={{textAlign:'center', width:'15%', paddingBottom:'10px'}}>Ghế</th>
                                        <th style={{textAlign:'right', width:'15%', paddingBottom:'10px'}}>Giá</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {booking.tickets?.map((ticket, idx) => (
                                        <tr key={idx} style={{borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
                                            {/* Tên Phim */}
                                            <td style={{padding:'12px 0', textAlign:'left', verticalAlign:'middle'}}>
                                                <span style={{display:'block', fontWeight:'500'}}>{ticket.movieTitle || "N/A"}</span>
                                            </td>

                                            {/* Suất chiếu (Ngày + Giờ) */}
                                            <td style={{textAlign:'center', verticalAlign:'middle'}}>
                                                <div style={{color:'#F4F169', fontWeight:'bold', fontSize:'1rem'}}>
                                                    {formatTime(ticket.startTime) || "--:--"}
                                                </div>
                                                <div style={{fontSize:'0.85rem', color:'#ccc'}}>
                                                    {formatDate(ticket.showtimesDate) || ""}
                                                </div>
                                            </td>

                                            {/* Phòng */}
                                            <td style={{textAlign:'center', verticalAlign:'middle'}}>
                                                {ticket.roomName || "N/A"}
                                            </td>

                                            {/* Ghế */}
                                            <td style={{textAlign:'center', fontWeight:'bold', color:'#F4F169', verticalAlign:'middle'}}>
                                                {ticket.seatName || "?"}
                                            </td>

                                            {/* Giá */}
                                            <td style={{textAlign:'right', verticalAlign:'middle'}}>
                                                {ticket.price ? ticket.price.toLocaleString() : 0}đ
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            <div style={{textAlign:'right', marginTop:'15px', fontSize:'1.1rem', borderTop:'1px solid #444', paddingTop:'15px'}}>
                                Tổng tiền: <strong style={{color:'#F4F169', fontSize:'1.3rem'}}>{booking.totalPrice?.toLocaleString()} đ</strong>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookingHistory;