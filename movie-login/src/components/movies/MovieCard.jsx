// components/movies/MovieCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/MovieCard.css'; // Sẽ tạo file CSS sau

const MovieCard = ({ movie }) => {
    return (
        <div className="movie-card">
            <Link to={`/phim/${movie.id}`}>
                <img 
                    src={movie.posterUrl || 'https://via.placeholder.com/300x450'} 
                    alt={movie.title} 
                    className="movie-card-poster"
                />
                <div className="movie-card-info">
                    <h3 className="movie-card-title">{movie.title}</h3>
                </div>
            </Link>
        </div>
    );
};

export default MovieCard;