// pages/user/MovieGridPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import * as movieService from '../../services/movieService';
import MovieCard from '../../components/movies/MovieCard';
import Pagination from '../../components/common/Pagination';

const MovieGridPage = () => {
    const location = useLocation(); // Dùng để đọc URL

    const [movies, setMovies] = useState([]);
    const [title, setTitle] = useState('');
    const [movieStatus, setMovieStatus] = useState(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // 1. Xác định trạng thái cần tải dựa trên URL
    useEffect(() => {
        if (location.pathname.includes('dang-chieu')) {
            setTitle('Phim Đang Chiếu');
            setMovieStatus('NOW_SHOWING');
        } else if (location.pathname.includes('sap-chieu')) {
            setTitle('Phim Sắp Chiếu');
            setMovieStatus('COMING_SOON');
        }
    }, [location.pathname]);

    // 2. Hàm gọi API (có phân trang)
    const fetchMoviesByStatus = useCallback(async (page) => {
        if (!movieStatus) return; // Chỉ chạy khi đã có status

        setIsLoading(true);
        setError(null);
        try {
            // Lấy 8 phim mỗi trang (hoặc 12 tùy bạn)
            const data = await movieService.getAllMovies(page, 12, { 
                movieStatus: movieStatus 
            });
            
            if (data && data.content) {
                setMovies(data.content);
                setTotalPages(data.totalPages || 0);
            } else {
                setMovies([]);
                setTotalPages(0);
            }
        } catch (err) {
            setError('Lỗi khi tải danh sách phim.');
        } finally {
            setIsLoading(false);
        }
    }, [movieStatus]); // Phụ thuộc vào movieStatus

    // 3. Gọi API khi trang thay đổi, hoặc khi status thay đổi
    useEffect(() => {
        fetchMoviesByStatus(currentPage);
    }, [currentPage, fetchMoviesByStatus]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderContent = () => {
        if (isLoading) return <p>Đang tải...</p>;
        if (error) return <p className="page-error-message">{error}</p>;
        if (movies.length === 0) return <p>Không có phim nào.</p>;

        return (
            <>
                <div className="movie-grid-fixed">
                    {movies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
                
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </>
        );
    };

    return (
        <div className="homepage-container"> {/* Tái sử dụng CSS từ HomePage */}
            <section className="movie-section">
                <h2>{title}</h2>
                {renderContent()}
            </section>
        </div>
    );
};

export default MovieGridPage;