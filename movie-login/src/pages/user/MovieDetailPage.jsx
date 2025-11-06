// pages/user/MovieDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as movieService from '../../services/movieService';
import '../../styles/UserLayout.css';

const MovieDetailPage = () => {
    const { movieId } = useParams(); // Lấy ID từ URL (ví dụ: /phim/123)
    const [movie, setMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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

    if (isLoading) return <p>Đang tải chi tiết phim...</p>;
    if (error) return <p className="page-error-message">{error}</p>;
    if (!movie) return <p>Không có thông tin phim.</p>;

    return (
        <div className="movie-detail-container">
            <h1>{movie.title}</h1>
            <div className="movie-detail-content">
                <img 
                    src={movie.posterUrl || 'https://via.placeholder.com/400x600'} 
                    alt={movie.title}
                    className="movie-detail-poster"
                />
                <div className="movie-detail-info">
                    <p><strong>Mô tả:</strong> {movie.description}</p>
                    <p><strong>Đạo diễn:</strong> {movie.director}</p>
                    <p><strong>Thời lượng:</strong> {movie.duration} phút</p>
                    <p><strong>Ngày phát hành:</strong> {new Date(movie.releaseDate).toLocaleDateString('vi-VN')}</p>
                    {/* ... Hiển thị thêm các thông tin khác ... */}
                    
                    {/* TODO (Bước sau): Hiển thị Lịch chiếu (Showtimes) ở đây */}
                </div>
            </div>
        </div>
    );
};

export default MovieDetailPage;