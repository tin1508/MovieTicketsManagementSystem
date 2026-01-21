// pages/user/MovieDetailPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import * as movieService from '../../services/movieService';
import Modal from '../../components/common/Modal';
import { getYoutubeEmbedUrl } from '../../utils/youtubeHelper';
import {FaPlay} from 'react-icons/fa';
import '../../styles/UserLayout.css';
import { useLocation } from 'react-router-dom'; 

import ShowtimesMovie from './ShowtimesMovie';
import SeatSelection from './SeatSelection';

const MovieDetailPage = () => {
    const navigate = useNavigate();
    const { movieId } = useParams(); 
    const [movie, setMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();
    const autoSelectShowtimeId = location.state?.autoSelectShowtimeId;

    const [isTrailerOpen, setIsTrailerOpen] = useState(false);

    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [ticketQuantity, setTicketQuantity] = useState(0);

    const seatSectionRef = useRef(null);

    const ageDescriptionMap = {
        'P': 'Phim dành cho mọi lứa tuổi',
        'K': 'Khán giả dưới 13 tuổi cần có người bảo hộ',
        'T13': 'Phim dành cho khán giả từ 13 tuổi trở lên',
        'C13': 'Phim dành cho khán giả từ 13 tuổi trở lên',
        'T16': 'Phim dành cho khán giả từ 16 tuổi trở lên',
        'C16': 'Phim dành cho khán giả từ 16 tuổi trở lên',
        'T18': 'Phim dành cho khán giả từ 18 tuổi trở lên',
        'C18': 'Phim dành cho khán giả từ 18 tuổi trở lên',
        // Thêm các mã khác nếu backend của bạn có
    };

    // Hàm lấy mô tả an toàn (tránh lỗi nếu code lạ)
    const getAgeDescription = (code) => {
        return ageDescriptionMap[code] || 'Yêu cầu độ tuổi phù hợp';
    };

    useEffect(() => {
        // Nếu đã có suất chiếu được chọn (do auto-select), cuộn xuống phần ghế
        if (selectedShowtime) {
            setTimeout(() => {
                seatSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300); // Delay một chút để DOM kịp render
        }
    }, [selectedShowtime]);
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const getMainActors = (actorString) => {
        if (!actorString) return [];
        const actorsArray = actorString.split(',');
        return actorsArray.map(a => a.trim()).slice(0, 3);
    };

    const hasMoreActors = movie && movie.actors && movie.actors.split(',').length > 3;
    const mainActors = movie ? getMainActors(movie.actors) : [];

    useEffect(() => {
        const fetchMovie = async () => {
            if (!movieId) return;
            
            setIsLoading(true);
            setError(null);
            try {
                const data = await movieService.getMovieById(movieId);
                setMovie(data);
            } catch (err) {
                setError('Không tìm thấy phim này.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovie();
    }, [movieId]);

    const embedUrl = movie ? getYoutubeEmbedUrl(movie.trailerUrl) : null;

    if (isLoading) return <p>Đang tải chi tiết phim...</p>;
    if (error) return <p className="page-error-message">{error}</p>;
    if (!movie) return <p>Không có thông tin phim.</p>;

    const handleConfirmShowtime = (showtime, quantity) => {
        // Khi HỦY → showtime = null
        if (!showtime) {
            setSelectedShowtime(null);
            setTicketQuantity(0);
            return;
        }

        setSelectedShowtime(showtime);
        setTicketQuantity(quantity);

        // Scroll xuống phần chọn ghế
        setTimeout(() => {
            seatSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
    };

    // 2️⃣ Thanh toán
    const handleProceedToPayment = (bookingId) => {
        console.log('Đi tới thanh toán với bookingId:', bookingId);
        navigate(`/payment/${bookingId}`);
    };

    return (
        <>
        <div className="movie-detail-container">
            <h1 className="movie-title">
                {movie.title || movie.name}
            </h1>
            <div className="movie-detail-content">
                <img 
                    src={movie.posterUrl || 'https://via.placeholder.com/400x600'} 
                    alt={movie.title}
                    className="movie-detail-poster"
                />
                <div className="movie-detail-info">
                

                {/* --- 1. THÊM THỂ LOẠI --- */}
                <p>
                    <strong>Thể loại:</strong>{' '}
                    {movie.genres && movie.genres.length > 0 
                        ? movie.genres.map(g => g.name).join(', ') // Nối tên các thể loại bằng dấu phẩy
                        : 'Đang cập nhật'}
                </p>

                <p>
                    <strong>Độ tuổi:</strong>
                    
                    {/* 1. Badge màu vàng (Nằm cùng dòng) */}
                    <span style={{ 
                        backgroundColor: '#ffc107', 
                        color: '#000', 
                        fontWeight: 'bold', 
                        padding: '1px 6px',     // Padding nhỏ lại chút cho gọn dòng
                        borderRadius: '4px', 
                        marginLeft: '8px',      // Cách chữ "Độ tuổi:" ra
                        marginRight: '8px',     // Cách dòng giải thích ra
                        fontSize: '0.85em',     // Nhỏ hơn chữ thường 1 xíu (85%) để không bị thô
                        verticalAlign: 'text-bottom' // Căn chỉnh cho thẳng hàng với dòng chữ
                    }}>
                        {movie.ageRating || 'T13'}
                    </span>

                    {/* 2. Dòng giải thích (Kế thừa font size của thẻ <p> cha) */}
                    <span style={{ color: '#ffffffff', fontWeight: 'normal' }}>
                        - {getAgeDescription(movie.ageRating)}
                    </span>
                </p>

                {/* --- CÁC THÔNG TIN CŨ --- */}
                <p><strong>Đạo diễn:</strong> {movie.director}</p>
                <p><strong>Thời lượng:</strong> {movie.duration} phút</p>
                <p><strong>Ngày phát hành:</strong> {new Date(movie.releaseDate).toLocaleDateString('vi-VN')}</p>

                {/* --- 3. SỬA HIỂN THỊ DIỄN VIÊN (Dạng văn bản thường) --- */}
                {mainActors.length > 0 && (
                    <p>
                        <strong>Diễn viên:</strong>{' '}
                        {/* Nối mảng 3 tên thành chuỗi, ngăn cách bởi dấu phẩy */}
                        {mainActors.join(', ')}
                        
                        {/* Nếu còn nhiều hơn 3 người thì hiện dấu ... */}
                        {hasMoreActors && '...'}
                    </p>
                )}

                <p style={{marginTop: '15px'}}><strong>Mô tả:</strong> {movie.description}</p>
                {embedUrl && (
                    <button 
                        className="btn-watch-trailer" 
                        onClick={() => setIsTrailerOpen(true)}
                    >
                        <FaPlay /> Xem Trailer
                    </button>
                )}
            </div>
            </div>
        </div>
        {/* ===== BOOKING SECTION ===== */}
            <div className="booking-wrapper">
                <div className="movie-detail-container">
                    <h2 className="booking-section-title">LỊCH CHIẾU</h2>

                    <ShowtimesMovie
                        movieId={movieId}
                        onConfirmSelection={handleConfirmShowtime}
                        preSelectedShowtimeId={autoSelectShowtimeId} 
                    />
                </div>

                {/* ===== SEAT SELECTION ===== */}
                <div ref={seatSectionRef}>
                    {selectedShowtime && ticketQuantity > 0 && (
                        <SeatSelection
                            showtimeId={selectedShowtime.id}
                            ticketQuantity={ticketQuantity}
                            onNext={handleProceedToPayment}
                        />
                    )}
                </div>
            </div>
        {embedUrl && (
                <Modal
                    isOpen={isTrailerOpen}
                    onClose={() => setIsTrailerOpen(false)}
                    title={`Trailer: ${movie.title}`}
                    // Chúng ta thêm 1 class đặc biệt để CSS riêng cho trailer
                    customClass="trailer-modal" 
                >
                    <div className="trailer-iframe-container">
                        <iframe
                            src={embedUrl}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default MovieDetailPage;