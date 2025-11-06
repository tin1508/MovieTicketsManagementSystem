// pages/user/HomePage.jsx
import '../../styles/UserLayout.css';
import React, { useState, useEffect } from 'react';
import * as movieService from '../../services/movieService';
import MovieCard from '../../components/movies/MovieCard';

const HomePage = () => {
    const [nowShowingMovies, setNowShowingMovies] = useState([]);
    const [comingSoonMovies, setComingSoonMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllMovies = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Lấy phim đang chiếu
                const nowShowingData = await movieService.getAllMovies(0, 10, { 
                    movieStatus: 'NOW_SHOWING' 
                });
                setNowShowingMovies(nowShowingData.content || []);

                // Lấy phim sắp chiếu
                const comingSoonData = await movieService.getAllMovies(0, 10, { 
                    movieStatus: 'COMING_SOON' 
                });
                setComingSoonMovies(comingSoonData.content || []);

            } catch (err) {
                setError('Lỗi khi tải danh sách phim.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllMovies();
    }, []);

    if (isLoading) return <p>Đang tải...</p>;
    if (error) return <p className="page-error-message">{error}</p>;

    return (
        <div className="homepage-container">
            <section className="movie-section">
                <h2>Phim Đang Chiếu</h2>
                <div className="movie-grid">
                    {nowShowingMovies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </section>

            <section className="movie-section">
                <h2>Phim Sắp Chiếu</h2>
                <div className="movie-grid">
                    {comingSoonMovies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;