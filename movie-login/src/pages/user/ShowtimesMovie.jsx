import React, {useEffect, useState} from 'react';
import {getAvailableDateByMovie, getShowtimesByMovieAndDate} from '../../services/ShowtimesService';
import '../../styles/Bookings.css';

const formatDate = (dateString) => {
  // Tạo đối tượng Date (Thêm 'T00:00:00' để tránh lỗi múi giờ)
    const dateObj = new Date(`${dateString}T00:00:00`);
    const dayName = dateObj.toLocaleDateString('vi-VN', { weekday: 'long' });
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const dayNumber = `${day}/${month}`;
    return { dayName , dayNumber };
};

const ShowtimesMovie = ({movieId, onConfirmSelection,  isDisabled}) => {
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [loadingDates, setLoadingDates] = useState(false);
    const [loadingShowtimes, setLoadingShowtimes] = useState(false);
    const [error, setError] = useState(null);

    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [ticketQuantity, setTicketQuantity] = useState(0);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const maxTickets = selectedShowtime?.room?.totalSeats ? Math.max(10, selectedShowtime.room.totalSeats) : 10;

  

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        if(value === ''){
            setTicketQuantity('');
            return;
        }
        const parsedValue = parseInt(value, 10);

        if (!isNaN(parsedValue)) {
            if (parsedValue > maxTickets) {
                setTicketQuantity(maxTickets);
            } else if (parsedValue < 0) {
                setTicketQuantity(0);
            } else {
                setTicketQuantity(parsedValue);
            }
        }
    }
    const handleBlur = () => {
        if (ticketQuantity === '' || ticketQuantity === null) {
            setTicketQuantity(0);
        }
    };
    const handleIncreaseQuantity = () => {
        const currentQty = Number(ticketQuantity) || 0; // Treat '' as 0
        if (currentQty < maxTickets) {
            setTicketQuantity(currentQty + 1);
        }
    };
    const handleConfirmedClick = () => {
        if(!selectedShowtime || ticketQuantity <= 0){
            alert("Vui lòng chọn suất chiếu và số lượng vé lớn hơn 0.");
            return;
        }
        setIsConfirmed(true);
        onConfirmSelection(selectedShowtime, ticketQuantity);
    };
    const handleCancel = () => {
        setIsConfirmed(false);
        setTicketQuantity(0);
        onConfirmSelection(null, 0);
    }
    const handleDecreaseQuantity = () => {
        const currentQty = Number(ticketQuantity) || 0;
        if (currentQty > 0) {
            setTicketQuantity(currentQty - 1);
        }
    };
    useEffect(() => {
        // Chỉ chạy khi có movieId
        if (movieId) {
            setLoadingDates(true);
            setError(null);
            setDates([]); // Xóa ngày cũ
            setSelectedDate(null); // Bỏ chọn ngày
            setShowtimes([]); // Xóa giờ chiếu cũ

            
            getAvailableDateByMovie(movieId)
                .then(response => {
                const dateData = response.data.result;
                setDates(dateData || []);

                // Tự động chọn ngày đầu tiên trong danh sách
                })
                .catch(err => {
                console.error("Lỗi khi tải ngày chiếu:", err);
                setError("Không thể tải lịch chiếu. Vui lòng thử lại.");
                })
                .finally(() => {
                setLoadingDates(false);
                });
        }
    }, [movieId]);
    useEffect(() => {
        if (movieId && selectedDate) {
        setLoadingShowtimes(true);
        setError(null);
        setShowtimes([]);
        
        getShowtimesByMovieAndDate(movieId, selectedDate)
            .then(response => {
            const showtimeData = response.data.result;
            if(showtimeData && showtimeData.length > 0){
                showtimeData.sort((a, b) => a.startTime.localeCompare(b.startTime));
            }
            setShowtimes(showtimeData || []); 
        })
        .catch(err => console.error("Lỗi tải giờ:", err))
        .finally(() => setLoadingShowtimes(false));
        }
    }, [selectedDate, movieId]);
    return (
        <div className={`showtimes-container ${isDisabled ? 'disabled' : ''}`}>
        {/* PHẦN HIỂN THỊ NGÀY CHIẾU */}
        <div className="section-step fade-in">
            <h5>Chọn ngày</h5>
            {loadingDates && <p>Đang tải lịch chiếu...</p>}
            {!loadingDates && dates.length > 0 && (
            <div className="date-list">
                {dates.map(dateString => {
                    const formattedDate = formatDate(dateString); // (Bạn cần hàm formatDate này)
                    return (
                    <button
                        key={dateString}
                        className={`date-btn ${selectedDate === dateString ? 'active' : ''}`}
                        onClick={() => setSelectedDate(dateString)}
                        disabled={isDisabled}
                    >
                        {/* Cấu trúc 2 span này là BẮT BUỘC */}
                        <span className="date-day-name">{formattedDate.dayName}</span>
                        <span className="date-day-number">{formattedDate.dayNumber}</span>
                    </button>
                    );
                })}
                </div>
            )}
            {!loadingDates && dates.length === 0 && !error && (
            <p>Phim này hiện chưa có lịch chiếu.</p>
            )}
        </div>

        <hr />

        {/* PHẦN HIỂN THỊ GIỜ CHIẾU (CHỈ HIỆN KHI ĐÃ CHỌN NGÀY) */}
        {selectedDate && (
            <div className="section-step slide-down">
            <h5>Giờ chiếu ngày {formatDate(selectedDate).dayNumber}</h5>
            {loadingShowtimes && <p>Đang tải suất chiếu...</p>}
            
            {!loadingShowtimes && showtimes.length > 0 && (
                <div className="time-grid">
                {showtimes.map(show => (
                    <button key={show.startTime} className={`time-btn ${selectedShowtime?.startTime === show.startTime ? 'active' : ''}`}
                    onClick={() => setSelectedShowtime(show)}
                    disabled={isDisabled}
                    >
                    {show.startTime.substring(0,5)}
                    </button>
                ))}
                </div>
            )}
            
            {!loadingShowtimes && showtimes.length === 0 && !error && (
                <p>Không có suất chiếu cho ngày này.</p>
            )}
            </div>
        )}
        {selectedDate && selectedShowtime && ( 
            <>
                <hr />
                <div className="section-step slide-down ticket-quantity-selector">
                {/* Bỏ tiêu đề "Chọn số lượng vé" nếu không cần */}
                <h5>Chọn số lượng vé</h5>
                
                <div className="quantity-controls">
                    <button 
                        className="quantity-btn minus" 
                        onClick={handleDecreaseQuantity}
                        disabled={isDisabled || ticketQuantity <= 0} // Vô hiệu hóa khi số lượng là 0
                    >
                    -
                    </button>
                    <input 
                        type="number"
                        className="quantity-input"
                        value={ticketQuantity}
                        onChange={handleQuantityChange}
                        onBlur={handleBlur}
                        disabled={isDisabled}
                        min="0"
                        max={maxTickets}
                    />
                    {/* <span className="quantity-display">{ticketQuantity}</span> */}
                    <button 
                        className="quantity-btn plus" 
                        onClick={handleIncreaseQuantity}
                        disabled={isDisabled || ticketQuantity >= maxTickets} // Vô hiệu hóa khi số lượng là 10
                    >
                        +
                    </button>
                </div>
                {selectedShowtime?.room?.totalSeats && (
                    <small style={{display: 'block', marginTop: '5px', color: '#888'}}>
                        (Tối đa: {maxTickets} vé)
                    </small>
                )}
                {!isConfirmed ? (
                    <button 
                    className="btn-continue" 
                    onClick={handleConfirmedClick}
                    disabled={isDisabled || !selectedShowtime || ticketQuantity <= 0} // Vô hiệu hóa nếu chưa chọn vé
                    >
                    Xác nhận
                    </button>
                ) : (
                    <button className="btn-cancel" onClick={handleCancel}>
                        Hủy
                    </button>
                )}
                </div>
            </>
            )}
        {/* Hiển thị lỗi chung nếu có */}
        {error && <p className="error-message">{error}</p>}
        
        </div>
    );
};

export default ShowtimesMovie;
