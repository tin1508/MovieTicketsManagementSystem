// pages/user/MovieDetailPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as movieService from '../../services/movieService';
import Modal from '../../components/common/Modal';
import { getYoutubeEmbedUrl } from '../../utils/youtubeHelper';
import { FaPlay } from 'react-icons/fa';
import '../../styles/UserLayout.css';

import ShowtimesMovie from './ShowtimesMovie';
import SeatSelection from './SeatSelection';

const MovieDetailPage = () => {
    const { movieId } = useParams();
    const navigate = useNavigate();

    const [movie, setMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);

    // ===== STATE BOOKING FLOW =====
    const [selectedShowtime, setSelectedShowtime] = useState(null);
    const [ticketQuantity, setTicketQuantity] = useState(0);

    const seatSectionRef = useRef(null);

    /* ================= FETCH MOVIE ================= */

    useEffect(() => {
        if (!movieId) return;

        setIsLoading(true);
        movieService.getMovieById(movieId)
            .then(res => setMovie(res))
            .catch(() => setError("Không tìm thấy phim"))
            .finally(() => setIsLoading(false));
    }, [movieId]);

    /* ================= CALLBACKS ================= */

    // 1️⃣ Nhận dữ liệu từ ShowtimesMovie
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

    /* ================= RENDER ================= */

    if (isLoading) return <p>Đang tải chi tiết phim...</p>;
    if (error) return <p className="page-error-message">{error}</p>;
    if (!movie) return null;

    const embedUrl = getYoutubeEmbedUrl(movie.trailerUrl);

    return (
        <>
            {/* ===== MOVIE INFO ===== */}
            <div className="movie-detail-container">
                <h1>{movie.title}</h1>

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

            {/* ===== TRAILER MODAL ===== */}
            {embedUrl && (
                <Modal
                    isOpen={isTrailerOpen}
                    onClose={() => setIsTrailerOpen(false)}
                    title={`Trailer: ${movie.title}`}
                    customClass="trailer-modal"
                >
                    <div className="trailer-iframe-container">
                        <iframe
                            src={embedUrl}
                            title="Trailer"
                            frameBorder="0"
                            allowFullScreen
                        />
                    </div>
                </Modal>
            )}
        </>
    );
};

export default MovieDetailPage;
