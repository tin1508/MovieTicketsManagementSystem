import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as movieService from '../../services/movieService';
// SỬA IMPORT: Gọi đúng 2 hàm bạn đang có trong service
import { getAvailableDateByMovie, getShowtimesByMovieAndDate } from '../../services/ShowtimesService'; 
import '../../styles/QuickBookingBar.css';

const QuickBookingBar = () => {
    const navigate = useNavigate();

    // Data lists
    const [movies, setMovies] = useState([]);
    
    // Derived Lists (Danh sách dữ liệu phụ thuộc)
    const [availableDates, setAvailableDates] = useState([]); // List ngày
    const [availableTimes, setAvailableTimes] = useState([]); // List giờ

    // Selected States (Giá trị đang chọn)
    const [selectedMovieId, setSelectedMovieId] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedShowtimeId, setSelectedShowtimeId] = useState('');

    // 1. Lấy danh sách phim đang chiếu khi load trang
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await movieService.getAllMovies(0, 100, { movieStatus: 'NOW_SHOWING' });
                setMovies(response.content || response.data || []); 
            } catch (error) {
                console.error("Lỗi lấy danh sách phim:", error);
            }
        };
        fetchMovies();
    }, []);

    // 2. KHI CHỌN PHIM -> Gọi API lấy danh sách NGÀY
    const handleMovieChange = async (e) => {
        const movieId = e.target.value;
        
        // Reset lại các lựa chọn cũ
        setSelectedMovieId(movieId);
        setSelectedDate('');
        setSelectedShowtimeId('');
        setAvailableDates([]);
        setAvailableTimes([]);

        if (!movieId) return;

        try {
            const res = await getAvailableDateByMovie(movieId);
            
            // --- SỬA DÒNG NÀY ---
            // Ưu tiên lấy res.result (nếu đã qua interceptor) 
            // Sau đó mới thử res.data.result (nếu chưa qua interceptor)
            const dates = res.result || res.data?.result || res.data || []; 
            // --------------------

            console.log("Dates debug:", dates); // Bật log để kiểm tra
            setAvailableDates(dates.sort());
        } catch (err) {
            console.error("Lỗi lấy ngày chiếu:", err);
        }
    };
    // 3. KHI CHỌN NGÀY -> Gọi API lấy danh sách GIỜ (Suất chiếu)
    const handleDateChange = async (e) => {
        const date = e.target.value;
        
        setSelectedDate(date);
        setSelectedShowtimeId(''); // Reset giờ cũ
        setAvailableTimes([]);

        if (!date) return;

        try {
            const res = await getShowtimesByMovieAndDate(selectedMovieId, date);
            
            // --- SỬA DÒNG NÀY ---
            const times = res.result || res.data?.result || res.data || [];
            // --------------------

            times.sort((a, b) => a.startTime.localeCompare(b.startTime));
            setAvailableTimes(times);
        } catch (err) {
            console.error("Lỗi lấy giờ chiếu:", err);
        }
    };

    // 4. Xử lý nút Mua Vé
    const handleQuickBook = () => {
        if (selectedMovieId && selectedShowtimeId) {
            navigate(`/movie/${selectedMovieId}`, { 
                state: { autoSelectShowtimeId: selectedShowtimeId } 
            });
        } else {
            alert("Vui lòng chọn đầy đủ thông tin!");
        }
    };

    return (
        <div className="quick-booking-bar">
            {/* Chọn Phim */}
            <select className="quick-select" value={selectedMovieId} onChange={handleMovieChange}>
                <option value="">Chọn Phim</option>
                {movies.map(movie => (
                    <option key={movie.id} value={movie.id}>{movie.title}</option>
                ))}
            </select>

            {/* Chọn Ngày */}
            <select 
                className="quick-select" 
                value={selectedDate} 
                onChange={handleDateChange}
                disabled={!selectedMovieId}
            >
                <option value="">Chọn Ngày</option>
                {availableDates.length > 0 ? (
                    availableDates.map((date, index) => (
                        <option key={index} value={date}>
                            {new Date(date).toLocaleDateString('vi-VN')}
                        </option>
                    ))
                ) : (
                    <option value="" disabled>Không có lịch</option>
                )}
            </select>

            {/* Chọn Giờ */}
            <select 
                className="quick-select" 
                value={selectedShowtimeId} 
                onChange={(e) => setSelectedShowtimeId(e.target.value)}
                disabled={!selectedDate}
            >
                <option value="">Chọn Suất Chiếu</option>
                {availableTimes.length > 0 ? (
                    availableTimes.map(show => (
                        <option key={show.id} value={show.id}>
                            {show.startTime.slice(0, 5)} - {show.room?.name || 'Rạp'}
                        </option>
                    ))
                ) : (
                    <option value="" disabled>Hết suất</option>
                )}
            </select>

            <button 
                className="btn-quick-book" 
                onClick={handleQuickBook}
                disabled={!selectedShowtimeId}
            >
                MUA VÉ NGAY
            </button>
        </div>
    );
};

export default QuickBookingBar;