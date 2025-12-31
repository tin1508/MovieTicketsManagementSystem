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
                    {embedUrl && (
                            <button 
                                className="btn-watch-trailer" 
                                onClick={() => setIsTrailerOpen(true)}
                            >
                                <FaPlay /> Xem Trailer
                            </button>
                        )}
                    <p><strong>Mô tả:</strong> {movie.description}</p>
                    <p><strong>Đạo diễn:</strong> {movie.director}</p>
                    <p><strong>Thời lượng:</strong> {movie.duration} phút</p>
                    <p><strong>Ngày phát hành:</strong> {new Date(movie.releaseDate).toLocaleDateString('vi-VN')}</p>
                    {mainActors.length > 0 && (
                                <div style={{marginBottom: '10px'}}>
                                    <strong style={{color: '#ffc107', display: 'block', marginBottom: '8px'}}>
                                        Diễn viên chính:
                                    </strong>
                                    
                                    <div className="actor-list">
                                        {/* Map qua danh sách 3 diễn viên chính */}
                                        {mainActors.map((actor, index) => (
                                            <span key={index} className="actor-badge">
                                                {actor}
                                            </span>
                                        ))}

                                        {/* Nếu danh sách gốc dài hơn 3, hiện thêm dấu ... */}
                                        {hasMoreActors && (
                                            <span className="actor-badge more" title={movie.actors}>
                                                +{movie.actors.split(',').length - 3} khác
                                            </span>
                                        )}
                                    </div>
                                </div>
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