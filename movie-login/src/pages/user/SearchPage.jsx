// pages/user/SearchPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as movieService from '../../services/movieService';
import MovieCard from '../../components/movies/MovieCard';
import Pagination from '../../components/common/Pagination';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('q'); // Lấy keyword từ URL (ví dụ: ?q=phim)

    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchSearchResults = useCallback(async (page) => {
        if (!keyword) {
            setMovies([]);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            // Tái sử dụng hàm getAllMovies với filter 'keyword'
            const data = await movieService.getAllMovies(page, 8, { 
                keyword: keyword 
            });
            
            if (data && data.content) {
                setMovies(data.content);
                setTotalPages(data.totalPages || 0);
            } else {
                setMovies([]);
                setTotalPages(0);
            }
        } catch (err) {
            setError('Lỗi khi tìm kiếm phim.');
        } finally {
            setIsLoading(false);
        }
    }, [keyword]); // Phụ thuộc vào 'keyword'

    useEffect(() => {
        fetchSearchResults(currentPage);
    }, [currentPage, fetchSearchResults]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderContent = () => {
        if (isLoading) return <p>Đang tìm kiếm...</p>;
        if (error) return <p className="page-error-message">{error}</p>;
        if (movies.length === 0 && !isLoading) return <p>Không tìm thấy kết quả nào cho "{keyword}".</p>;

        return (
            <>
                <div className="movie-grid">
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
                <h2>Kết quả tìm kiếm cho: "{keyword}"</h2>
                {renderContent()}
            </section>
        </div>
    );
};

export default SearchPage;