import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as paymentService from '../../services/PaymentService';
import '../../styles/PaymentPage.css';
import BookingInfo from './BookingInfo';
import { FaArrowLeft, FaSpinner, FaTicketAlt, FaCopy, 
    FaCheckCircle, FaMapMarkerAlt, FaCalendarAlt, 
    FaClock, FaChair, FaCalendarCheck } from 'react-icons/fa';

// Helper format tiền tệ
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const PaymentPage = () => {
    const navigator = useNavigate();
    const { bookingId } = useParams();

    // Chỉ cần 1 state Payment là đủ (vì trong payment đã có booking)
    const [payment, setPayment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentBookingDate = new Date().toLocaleDateString('vi-VN');

    useEffect(() => {
        if (!bookingId) {
            setError("Không tìm thấy thông tin đặt vé.");
            setIsLoading(false);
            return;
        }

        const handleCreateAndFetchPayment = async () => {
            try {
                setIsLoading(true);
                // 1. Gọi API tạo Payment (Backend sẽ trả về kèm cả thông tin Booking)
                const response = await paymentService.createPayment({ bookingId: bookingId });
                const paymentData = response.data.result || response.data;
                
                console.log("Payment Data:", paymentData); // Debug để xem cấu trúc
                setPayment(paymentData);

            } catch (err) {
                console.error("Lỗi khi tạo thanh toán:", err);
                // Xử lý thông báo lỗi đẹp hơn tùy vào mã lỗi backend trả về
                if (err.response?.data?.code === 1009) { // Ví dụ mã lỗi BOOKING_PAID
                    alert("Đơn hàng này đã được thanh toán!");
                    navigator('/profile/history');
                } else {
                    setError("Không thể khởi tạo thanh toán. Vui lòng thử lại.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        handleCreateAndFetchPayment();
    }, [bookingId]);

    if (isLoading) return (
        <div className='loading-container'>
            <FaSpinner className='spinner-icon' />
            <p>Đang khởi tạo giao dịch...</p>
        </div>
    );

    if (error) return (
        <div className='error-container'>
            <p className='error-message'>{error}</p>
            <button className='btn-back' onClick={() => navigator(-1)}>Quay lại</button>
        </div>
    );

    if (!payment) return null;

    // Rút gọn biến để code bên dưới đỡ dài dòng
    // Dữ liệu booking nằm lồng bên trong payment
    const booking = payment.booking; 

    return (
        <div className="movie-detail-container checkout-container">
            <button className="btn-back" onClick={() => navigator(-1)}>
                <FaArrowLeft /> Quay lại
            </button>

            <h1 className="booking-section-title">THANH TOÁN VÉ XEM PHIM</h1>

            <div className="checkout-layout" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
                
                {/* ===== LEFT: THÔNG TIN VÉ (Lấy từ payment.booking) ===== */}
                <BookingInfo booking={booking} />

                {/* ===== RIGHT: QR CODE (Lấy trực tiếp từ payment) ===== */}
                <div className="payment-qr-card" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <div className="qr-header" style={{ textAlign: 'center', marginBottom: '15px' }}>
                        <h3>Quét mã thanh toán</h3>
                    </div>

                    <div className="qr-wrapper" style={{ background: '#fff', padding: '20px', borderRadius: '10px', display: 'inline-block', margin: '0 auto' }}>
                        <img
                            src={payment.qrBankUrl}
                            alt="VietQR Payment Code"
                            className="payment-qr-image"
                            style={{ width: '100%', maxWidth: '250px', display: 'block' }}
                        />
                    </div>

                    <div className="transfer-info" style={{ marginTop: '25px', textAlign: 'left', width: '100%' }}>
                        <div className="bill-item">
                            <span style={{color: '#aaa'}}>Nội dung CK:</span>
                            <div className="memo-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.1)', padding: '10px 12px', borderRadius: '6px', marginTop: '5px' }}>
                                <code style={{ color: '#F4F169', fontWeight: 'bold', fontSize: '1.1rem' }}>{payment.transactionId}</code>
                                <FaCopy
                                    className="copy-btn"
                                    title="Sao chép"
                                    style={{ cursor: 'pointer', color: '#325c94f3' }}
                                    onClick={() => {
                                        window.navigator.clipboard.writeText(payment.transactionId);
                                        alert("Đã sao chép nội dung!");
                                    }}
                                />
                            </div>
                        </div>
                        <div className="bill-item" style={{ marginTop: '15px', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{color: '#aaa'}}>Số tiền:</span>
                            <strong style={{ color: '#F4F169', fontSize: '1.2rem' }}>{formatCurrency(payment.amount)}</strong>
                        </div>
                    </div>

                    <div className="payment-note" style={{ marginTop: '20px', fontSize: '0.9rem', color: '#aaa', fontStyle: 'italic' }}>
                        <p>⚠️ Hệ thống sẽ tự động xử lý đơn hàng sau khi nhận được tiền. Vui lòng không tắt trình duyệt.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;