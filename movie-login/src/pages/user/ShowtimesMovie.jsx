import React, {useEffect, useState} from 'react';
// 1. THÊM IMPORT getShowtimeById
import {getAvailableDateByMovie, getShowtimesByMovieAndDate, getShowtimeById} from '../../services/ShowtimesService';
import '../../styles/Bookings.css';

const formatDate = (dateString) => {
    const dateObj = new Date(`${dateString}T00:00:00`);
    const dayName = dateObj.toLocaleDateString('vi-VN', { weekday: 'long' });
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const dayNumber = `${day}/${month}`;
    return { dayName , dayNumber };
};

// 2. THÊM preSelectedShowtimeId VÀO PROPS
const ShowtimesMovie = ({movieId, onConfirmSelection, isDisabled, preSelectedShowtimeId}) => {
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

    // --- LOGIC MỚI: TỰ ĐỘNG CHỌN NGÀY VÀ GIỜ TỪ QUICK BOOKING ---
    useEffect(() => {
        const autoSelect = async () => {
            // Chỉ chạy nếu có ID được truyền vào và chưa chọn suất nào
            if (preSelectedShowtimeId && !selectedShowtime) {
                console.log("🚀 Auto-selecting showtime ID:", preSelectedShowtimeId);
                try {
                    // Gọi API lấy chi tiết suất chiếu để biết nó thuộc NGÀY nào
                    const res = await getShowtimeById(preSelectedShowtimeId);
                    const targetShowtime = res.data?.result || res.result;

                    if (targetShowtime && targetShowtime.showtimesDate) {
                        // 1. Tự động chọn Ngày
                        setSelectedDate(targetShowtime.showtimesDate);
                        
                        // Lưu ý: Việc chọn giờ (selectedShowtime) sẽ được xử lý 
                        // ở useEffect phía dưới, sau khi danh sách showtimes đã tải xong.
                    }
                } catch (err) {
                    console.error("Lỗi khi auto-select suất chiếu:", err);
                }
            }
        };
        autoSelect();
    }, [preSelectedShowtimeId]);

    // --- LOGIC MỚI: TỰ ĐỘNG HIGHLIGHT GIỜ SAU KHI LIST GIỜ ĐÃ TẢI ---
    useEffect(() => {
        if (preSelectedShowtimeId && showtimes.length > 0 && !selectedShowtime) {
            const target = showtimes.find(s => String(s.id) === String(preSelectedShowtimeId));
            if (target) {
                setSelectedShowtime(target);
                // Cuộn xuống phần chọn số lượng (nếu cần)
                const element = document.querySelector('.ticket-quantity-selector');
                if(element) element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [showtimes, preSelectedShowtimeId]);
    // -------------------------------------------------------------

    const handleQuantityChange = (e) => {
        if(isConfirmed) return;
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
        const currentQty = Number(ticketQuantity) || 0; 
        if (currentQty < maxTickets) {
            setTicketQuantity(currentQty + 1);
        }
    };
    const handleConfirmedClick = () => {
        if(!selectedShowtime || ticketQuantity <= 0){
            alert("Vui lòng chọn suất chiếu và số lượng vé lớn hơn 0.");
            return;
        }
        const step1State = {
            movieId: movieId,
            selectedDate: selectedDate,
            selectedShowtime: selectedShowtime,
            ticketQuantity: ticketQuantity,
            isConfirmed: true
        }
        sessionStorage.setItem("bookingStep1State", JSON.stringify(step1State));
        setIsConfirmed(true);
        onConfirmSelection(selectedShowtime, ticketQuantity, selectedDate);
    };
    const handleCancel = () => {
        sessionStorage.removeItem("bookingStep1State");
        sessionStorage.removeItem("bookingState");
        setIsConfirmed(false);
        setTicketQuantity(0);
        onConfirmSelection(null, 0, null);
    }
    const handleDecreaseQuantity = () => {
        const currentQty = Number(ticketQuantity) || 0;
        if (currentQty > 0) {
            setTicketQuantity(currentQty - 1);
        }
    };
    const handleDateClick = (dateString) => {
        if(isDisabled || isConfirmed) return;
        setSelectedDate(dateString);
    };
    const handleTimeClick = (show) => {
        if(isDisabled || isConfirmed) return;
        setSelectedShowtime(show);
    }

    const isShowtimeValid = (showtimeDate, startTimeStr) => {
        const now = new Date();
        const showDate = new Date(showtimeDate); 
        
        if (showDate > now.setHours(0,0,0,0)) return true;

        if (showDate.toDateString() === now.toDateString()) {
            const [hours, minutes] = startTimeStr.split(':').map(Number);
            const showTime = new Date();
            showTime.setHours(hours, minutes, 0, 0);
            return showTime > now;
        }
        return false;
    };

    useEffect(() => {
        if (movieId) {
            setLoadingDates(true);
            setError(null);
            setDates([]); 
            setSelectedDate(null); 
            setShowtimes([]);

            getAvailableDateByMovie(movieId)
                .then(response => {
                    const dateData = response.data.result || response.result || []; // Fix cho chắc ăn
                    setDates(dateData);

                    // Logic khôi phục SessionStorage (giữ nguyên)
                    const savedJSON = sessionStorage.getItem("bookingStep1State");
                        if (savedJSON) {
                            const saved = JSON.parse(savedJSON);
                            if (saved.movieId == movieId && dateData.includes(saved.selectedDate)) {
                                setSelectedDate(saved.selectedDate);
                                setTicketQuantity(saved.ticketQuantity);
                            }
                        }
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
            setSelectedShowtime(null);
            setIsConfirmed(false);
        
            getShowtimesByMovieAndDate(movieId, selectedDate)
            .then(response => {
                const showtimeData = response.data.result || response.result;
                let validShowtimes = [];
                
                if(showtimeData && showtimeData.length > 0){
                    showtimeData.sort((a, b) => a.startTime.localeCompare(b.startTime));
                    validShowtimes = showtimeData.filter(show => 
                        isShowtimeValid(selectedDate, show.startTime) && show.status === 'SCHEDULED'
                    );
                    setShowtimes(validShowtimes);
                } else {
                    setShowtimes([]);
                }

                const savedJSON = sessionStorage.getItem("bookingStep1State");
                if (savedJSON) {
                    const saved = JSON.parse(savedJSON);
                    if (saved.movieId == movieId && saved.selectedDate === selectedDate && saved.selectedShowtime) {
                        const foundShowtime = validShowtimes.find(s => 
                            String(s.id) === String(saved.selectedShowtime.id) || 
                            s.startTime === saved.selectedShowtime.startTime
                        );
                        
                        if (foundShowtime) {
                            setSelectedShowtime(foundShowtime);
                            if (saved.isConfirmed) {
                                setIsConfirmed(true);
                                onConfirmSelection(foundShowtime, saved.ticketQuantity, selectedDate);
                            }
                        } 
                    }
                }
            })
            .catch(err => console.error("Lỗi tải giờ:", err))
            .finally(() => setLoadingShowtimes(false));
        }
    }, [selectedDate, movieId]);

    return (
        <div className={`showtimes-container ${isDisabled ? 'disabled' : ''}`}>
        <div className="section-step fade-in">
            <h5>Chọn ngày</h5>
            {loadingDates && <p>Đang tải lịch chiếu...</p>}
            {!loadingDates && dates.length > 0 && (
            <div className="date-list">
                {dates.map(dateString => {
                    const formattedDate = formatDate(dateString);
                    return (
                    <button
                        key={dateString}
                        className={`date-btn ${selectedDate === dateString ? 'active' : ''}`}
                        onClick={() => handleDateClick(dateString)}
                        disabled={isDisabled || isConfirmed}
                    >
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

        {selectedDate && (
            <div className="section-step slide-down">
            <h5>Giờ chiếu ngày {formatDate(selectedDate).dayNumber}</h5>
            {loadingShowtimes && <p>Đang tải suất chiếu...</p>}
            
            {!loadingShowtimes && showtimes.length > 0 && (
                <div className="time-grid">
                {showtimes.map(show => (
                    <button key={show.startTime} 
                        className={`time-btn ${selectedShowtime?.id === show.id ? 'active' : ''}`} // Fix so sánh theo ID
                        onClick={() => handleTimeClick(show)}
                        disabled={isDisabled || isConfirmed}
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
                <h5>Chọn số lượng vé</h5>
                
                <div className="quantity-controls">
                    <button 
                        className="quantity-btn minus" 
                        onClick={handleDecreaseQuantity}
                        disabled={isDisabled || isConfirmed || ticketQuantity <= 0} 
                    >
                    -
                    </button>
                    <input 
                        type="number"
                        className="quantity-input"
                        value={ticketQuantity}
                        onChange={handleQuantityChange}
                        onBlur={handleBlur}
                        disabled={isDisabled || isConfirmed}
                        min="0"
                        max={maxTickets}
                    />
                    <button 
                        className="quantity-btn plus" 
                        onClick={handleIncreaseQuantity}
                        disabled={isDisabled || isConfirmed || ticketQuantity >= maxTickets} 
                    >
                        +
                    </button>
                </div>

                {selectedShowtime?.room?.totalSeats && (
                    <small style={{display: 'block', marginTop: '5px', color: '#888'}}>
                        (Tối đa: {maxTickets} vé)
                    </small>
                )}

                <div style={{marginTop: '20px'}}>
                    {!isConfirmed ? (
                        <button 
                        className="btn-continue" 
                        onClick={handleConfirmedClick}
                        disabled={isDisabled || !selectedShowtime || ticketQuantity <= 0} 
                        >
                        Xác nhận & Chọn ghế
                        </button>
                    ) : (
                        <div style={{display:'flex', alignItems:'center', gap: '10px'}}>
                             <span style={{color: '#2ecc71', fontWeight: 'bold'}}>✓ Đã xác nhận</span>
                             
                            <button 
                                className="btn-cancel" 
                                onClick={handleCancel}
                                style={{background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor:'pointer'}}
                            >
                                Thay đổi / Hủy
                            </button>
                        </div>
                    )}
                </div>

                </div>
            </>
            )}
        
        {error && <p className="error-message">{error}</p>}
        
        </div>
    );
};

export default ShowtimesMovie;