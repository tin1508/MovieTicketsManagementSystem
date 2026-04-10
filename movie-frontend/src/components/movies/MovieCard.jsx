// components/movies/MovieCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/MovieCard.css'; // Sẽ tạo file CSS sau

const MovieCard = ({ movie }) => {
    const formatAgeRating = (ageRating) => {
        if(!ageRating) return 'N/A';
        switch(ageRating) {
            case 'P':
                return 'P';
            case 'T13':
                return '13+';
            case 'T16':
                return '16+';
            case 'T18':
                return '18+';
            default:
                return ageRating;
        }
    };

    const formatGenres = (genres) => {
        if (!genres || genres.length === 0) {
            return 'N/A';
        }
        // Lấy 2 thể loại đầu tiên, lấy tên (name), và nối chúng lại
        return genres.slice(0, 2).map(g => g.name).join(', ');
    };
    
    return (
        <div className="movie-card-wrapper">
            <div className="movie-card">
                <Link to={`/phim/${movie.id}`} className="movie-card-link">
                    <img 
                        src={movie.posterUrl || 'https://placehold.co/300x450'} 
                        alt={movie.title} 
                        className="movie-card-poster"
                    />
                    
                    {/* 3. Lớp phủ (Overlay) sẽ hiện ra khi hover */}
                    <div className="movie-card-overlay">
                        <div className="overlay-content">
                            <p><strong>Thể loại:</strong> {formatGenres(movie.genres)}</p>
                            <p><strong>Thời lượng:</strong> {movie.duration || 'N/A'} phút</p>
                            <p><strong>Giới hạn tuổi:</strong> {formatAgeRating(movie.ageRating)}</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* 4. Tên phim (Luôn hiển thị bên dưới) */}
            <h3 className="movie-card-title-standalone">
                <Link to={`/phim/${movie.id}`}>{movie.title}</Link>
            </h3>
        </div>
    );
};

export default MovieCard;