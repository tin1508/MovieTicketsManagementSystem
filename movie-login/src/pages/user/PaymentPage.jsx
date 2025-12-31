import React, { useState, useEffect , useRef} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as paymentService from '../../services/PaymentService';
import {cancelBooking} from '../../services/BookingsService';
import '../../styles/PaymentPage.css';
import BookingInfo from './BookingInfo';
import { FaArrowLeft, FaSpinner, FaCopy, 
    FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const BANK_INFO = {
    bankName: "MB Bank",
    accountName: "Nguyen Minh Hoang",
    accountNumber: "0764386915"
}
// Helper format tiền tệ
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};
const EXPIRED_TIME = 15;

// Hàm format giây thành MM:SS (Ví dụ: 900s -> 15:00)
const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
};

const PaymentPage = () => {
    const navigator = useNavigate();
    const { bookingId } = useParams();

    // Chỉ cần 1 state Payment là đủ (vì trong payment đã có booking)
    const [payment, setPayment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaid, setIsPaid] = useState(false);
    const [error, setError] = useState(null);

    const [timeLeft, setTimeLeft] = useState(EXPIRED_TIME * 60);
    const [isExpired, setIsExpired] = useState(false);
    const [showtimeOutModal, setShowtimeOutModal] = useState(false);

    const intervalRef = useRef(null);
    const timerRef = useRef(null);
    const hasCancelledRef = useRef(false);

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
                if(paymentData.status === 'SUCCESSFUL'){
                    setIsPaid(true);
                    sessionStorage.removeItem("bookingState");
                    sessionStorage.removeItem("bookingStep1State");
                }
                else{
                    const createdTime = new Date(paymentData.createdAt).getTime();
                    const expireTime = createdTime + (EXPIRED_TIME * 60 * 1000);
                    const now = new Date().getTime();
                    if(now > expireTime){
                        handleTransactionTimeout();
                    }
                    else{
                        const remainingSeconds = Math.floor((expireTime - now) / 1000);
                        setTimeLeft(remainingSeconds > 0 ? remainingSeconds : 0);
                    }
                }

            } catch (err) {
                console.error("Lỗi khi tạo thanh toán:", err);
                // Xử lý thông báo lỗi đẹp hơn tùy vào mã lỗi backend trả về
                if (err.response?.data?.code === 1009) { // Ví dụ mã lỗi BOOKING_PAID
                    alert("Đơn hàng này đã được thanh toán!");
                    navigator('/tai-khoan');
                } else {
                    setError("Không thể khởi tạo thanh toán. Vui lòng thử lại.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        handleCreateAndFetchPayment();

        return () => {
            stopPolling();
            if(timerRef.current) clearInterval(timerRef.current);
        }
    }, [bookingId]);

    const handleTransactionTimeout = async () => {
        if (hasCancelledRef.current) return; // Chặn gọi 2 lần
        hasCancelledRef.current = true;

        setIsExpired(true);
        setTimeLeft(0);
        stopPolling();
        clearInterval(timerRef.current);

        // Gọi API hủy booking / nhả ghế
        try {
            console.log("Hết thời gian thanh toán -> Đang hủy booking...");
            await cancelBooking(bookingId); // Hàm gọi API backend
        } catch (err) {
            console.error("Lỗi khi tự động hủy đơn:", err);
        }

        // Hiện Popup thông báo
        setShowtimeOutModal(true);
    };

    useEffect(() => {
        if (!payment || isPaid || isExpired) return ;
        
        const createdTime = new Date(payment.createdAt).getTime();
        const expireTime = createdTime + (EXPIRED_TIME * 60 * 1000);
        timerRef.current = setInterval(() => {
            const now = new Date().getTime();
            const distance = expireTime - now;
            if(distance <= 0){
                handleTransactionTimeout();
            }else{
                setTimeLeft(distance / 1000);
            }
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [payment, isPaid]);
    useEffect(() => {
        if (payment && !isPaid && !isExpired && !showtimeOutModal) {
            intervalRef.current = setInterval(async () => {
                try {
                    const res = await paymentService.getPaymentById(payment.id);
                    const currentStatus = res.data.result.paymentStatus; 

                    console.log("Checking status...", currentStatus);

                    if (currentStatus === 'SUCCESSFUL') {
                        setIsPaid(true);
                        stopPolling();
                        clearInterval(timerRef.current); // Dừng đếm ngược
                        // alert("Thanh toán thành công!"); // Có thể bỏ alert nếu muốn hiển thị UI đẹp
                    }
                } catch (error) {
                    console.error("Lỗi check status:", error);
                }
            }, 2000); 
        }
        return () => stopPolling();
    }, [payment, isPaid, isExpired, showtimeOutModal]);
    const stopPolling = () => {
        if(intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }
    const handleCopy = (text) => {
        window.navigator.clipboard.writeText(text);
        alert("Đã sao chép nội dung!");
    }
    if (isLoading) return (
        <div className='loading-container'>
            <FaSpinner className='spinner-icon' />
            <p>Đang khởi tạo giao dịch...</p>
        </div>
    );
    const handleCancelPayment = async () => {
        if(!payment || isPaid){
            navigator(-1);
            return;
        }
        try{
            await paymentService.deletePayment(payment.id);
            console.log("Đã hủy giao dịch!");
        }catch(error){
            console.error("Lỗi khi xóa payment: ", error);
        }finally{
            navigator(-1);
        }
    }
    const handleTimeoutModalClose = () => {
        setShowtimeOutModal(false);
        // Điều hướng về trang chi tiết phim
        // Giả sử booking.showtime.movie.id có tồn tại
        const movieId = payment?.booking?.showtime?.movie?.id;
        if (movieId) {
            navigator(`/phim/${movieId}`);
        } else {
            navigator('/'); // Fallback về trang chủ
        }
    };
    const handleBackButton = async () => {
        // Nếu đã thanh toán thành công -> Về trang chủ
        if (isPaid) {
            navigator('/');
            return;
        }

        // Nếu chưa thanh toán -> Giữ logic hủy cũ
        if (!payment) {
            navigator(-1);
            return;
        }
        const confirmCancel = window.confirm("Bạn có chắc muốn hủy giao dịch này?");
        if (!confirmCancel) return;

        try {
            await cancelBooking(bookingId);
            navigator(-1);
        } catch (error) {
            navigator(-1);
        }
    }
    if(isLoading) return (
        <div className='loading-container'>
            <FaSpinner className='spinner-icon' />
            <p>Đang khởi tạo giao dịch...</p>
        </div>
    )
    if (error) return (
        <div className='error-container'>
            <p className='error-message'>{error}</p>
            <button className='btn-back' onClick={() => navigator(-1)}>Quay lại</button>
        </div>
    );

    if (!payment) return null;

    const booking = payment.booking; 
    const layoutStyle = isPaid 
        ? { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }
        : { display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' };
    return (
        <div className="movie-detail-container checkout-container">
            {showtimeOutModal && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="modal-content" style={{
                        backgroundColor: '#fff', color: '#333',
                        padding: '30px', borderRadius: '10px',
                        textAlign: 'center', maxWidth: '400px', width: '90%'
                    }}>
                        <FaExclamationTriangle size={60} color="#e74c3c" style={{ marginBottom: '20px' }} />
                        <h3 style={{ margin: '0 0 10px 0', color: '#e74c3c' }}>Hết thời gian thanh toán!</h3>
                        <p style={{ fontSize: '1rem', color: '#555', marginBottom: '20px' }}>
                            Đơn hàng đã bị hủy và ghế đã được nhả ra do quá thời gian giữ chỗ (15 phút).
                        </p>
                        <button 
                            onClick={handleTimeoutModalClose}
                            style={{
                                backgroundColor: '#e74c3c', color: '#fff',
                                border: 'none', padding: '12px 30px',
                                borderRadius: '5px', fontSize: '1rem',
                                cursor: 'pointer', fontWeight: 'bold'
                            }}
                        >
                            Đồng ý
                        </button>
                    </div>
                </div>
            )}
            <button className="btn-back" onClick={handleBackButton}>
                <FaArrowLeft /> {isPaid ? "Trang chủ" : "Quay lại"}
            </button>

            <h1 className="booking-section-title">
                {isPaid ? "KẾT QUẢ GIAO DỊCH" : "THANH TOÁN VÉ XEM PHIM"}
            </h1>


            <div className={`checkout-layout ${isPaid ? 'layout-center' : ''}`}>
                
                {/* ===== LEFT: THÔNG TIN VÉ (Lấy từ payment.booking) ===== */}
                {!isPaid && <BookingInfo booking={booking} />}

                {/* ===== RIGHT: QR CODE (Lấy trực tiếp từ payment) ===== */}
                <div className="payment-qr-card" style={{display: 'flex', flexDirection: 'column', alignItems: 'top', justifyContent: 'center'}}>

                    {isExpired && !isPaid? (
                        <div className="expired-overlay" style={{textAlign: 'center', padding: '30px'}}>
                            <FaExclamationTriangle size={50} color="#e74c3c" style={{marginBottom: '15px'}} />
                            <h3 style={{color: '#e74c3c'}}>Hết thời gian giữ ghế!</h3>
                            <p style={{color: '#aaa', margin: '15px 0'}}>
                                Giao dịch đã bị hủy do quá thời gian thanh toán (15 phút).
                                Vui lòng đặt lại vé mới.
                            </p>
                            <button className="btn-confirm" onClick={() => navigator('/')} 
                                style={{background: '#e74c3c', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
                                Quay về trang chủ
                            </button>
                        </div>
                    ) : (
                        !isPaid ? (
                            <>
                            <div className="qr-header" style={{ textAlign: 'center', marginBottom: '10px' }}>
                                <h3>Quét mã thanh toán</h3>
                                {/* ĐỒNG HỒ ĐẾM NGƯỢC */}
                                <div className="countdown-timer" style={{
                                    background: '#fff3cd', color: '#856404', 
                                    padding: '5px 15px', borderRadius: '20px', 
                                    display: 'inline-block', marginTop: '10px', fontWeight: 'bold', fontSize: '0.9rem'
                                }}>
                                    Thời gian còn lại: {formatTime(timeLeft)}
                                </div>
                            </div>

                            <div className="qr-wrapper" style={{ background: '#fff', padding: '20px', borderRadius: '10px', display: 'inline-block', margin: '0 auto' }}>
                                <img
                                    src={payment.qrBankUrl}
                                    alt="VietQR Payment Code"
                                    className="payment-qr-image"
                                    style={{ width: '100%', maxWidth: '250px', display: 'block' }}
                                />
                                
                                {/* TRẠNG THÁI CHỜ */}
                                <div className="status-waiting" style={{marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f39c12', fontWeight: '500'}}>
                                    <span>Trạng thái: Chờ thanh toán...</span>
                                    <FaSpinner className="spinner-rotate" style={{marginLeft: '8px'}} /> 
                                </div>
                            </div>

                            <div className="transfer-info" style={{ marginTop: '25px', textAlign: 'left', width: '100%', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px' }}>
                                {/* Ngân hàng */}
                                <div className="bill-item" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                                    <span style={{color: '#aaa'}}>Ngân hàng:</span>
                                    <strong style={{ color: '#fff' }}>{BANK_INFO.bankName}</strong>
                                </div>

                                {/* Chủ tài khoản */}
                                <div className="bill-item" style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                                    <span style={{color: '#aaa'}}>Chủ tài khoản:</span>
                                    <strong style={{ color: '#fff', textTransform: 'uppercase' }}>{BANK_INFO.accountName}</strong>
                                </div>

                                {/* Số tài khoản */}
                                <div className="bill-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                                    <span style={{color: '#aaa'}}>Số tài khoản:</span>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                        <strong style={{ color: '#F4F169', fontSize: '1.1rem' }}>{BANK_INFO.accountNumber}</strong>
                                        <FaCopy 
                                            className="copy-btn" 
                                            style={{ cursor: 'pointer', color: '#325c94f3' }}
                                            onClick={() => handleCopy(BANK_INFO.accountNumber)}
                                        />
                                    </div>
                                </div>

                                {/* Số tiền */}
                                <div className="bill-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                                    <span style={{color: '#aaa'}}>Số tiền:</span>
                                    <strong style={{ color: '#F4F169', fontSize: '1.1rem' }}>{formatCurrency(payment.amount)}</strong>
                                </div>

                                {/* Nội dung CK */}
                                <div className="bill-item">
                                    <span style={{color: '#aaa', display: 'block', marginBottom: '4px'}}>Nội dung CK:</span>
                                    <div className="memo-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '6px' }}>
                                        <code style={{ color: '#F4F169', fontWeight: 'bold', fontSize: '1.1rem' }}>{payment.transactionId}</code>
                                        <FaCopy
                                            className="copy-btn"
                                            title="Sao chép"
                                            style={{ cursor: 'pointer', color: '#325c94f3' }}
                                            onClick={() => handleCopy(payment.transactionId)}
                                        />
                                    </div>
                                    <small style={{color: '#e74c3c', display:'block', marginTop: '5px', fontSize: '0.8rem'}}>
                                        * Vui lòng nhập chính xác nội dung chuyển khoản
                                    </small>
                                </div>
                            </div>

                            <div className="payment-note" style={{ marginTop: '20px', fontSize: '0.9rem', color: '#aaa', fontStyle: 'italic', textAlign: 'center' }}>
                                <p>⚠️ Hệ thống sẽ tự động xử lý đơn hàng sau khi nhận được tiền. Vui lòng không tắt trình duyệt.</p>
                            </div>
                        </>
                    ) : (
                        /* TRƯỜNG HỢP: THANH TOÁN THÀNH CÔNG (PAID) */
                        <div className="payment-success-card" >
                            <FaCheckCircle className="success-icon" size={80} />                            
                            <h2 className="success-title">Thanh toán thành công!</h2>
                            <p className='success-message'>Vé của bạn đã được xác nhận.</p>
                            
                            <div className="success-actions">
                                <button 
                                    className="btn-view-ticket" 
                                    onClick={() => navigator('/tai-khoan', {replace: true})}
                                >
                                    Xem vé của tôi
                                </button>
                            </div>
                        </div>
                    ))}
                    
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;