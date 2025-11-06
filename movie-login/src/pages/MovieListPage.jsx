import React, { useEffect, useCallback, useState } from 'react';
import { useDebounce } from 'use-debounce';
import MovieTable from '../components/movies/MovieTable';
import AddMovieForm from '../components/movies/AddMovieForm';
import Modal from '../components/common/Modal';
import EditMovieForm from '../components/movies/EditMovieForm';
import * as movieService from '../services/movieService';
import Pagination from '../components/common/Pagination';
import MovieFilter from '../components/movies/MovieFilter';

const MovieListPage = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentMovieToEdit, setCurrentMovieToEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [movieToDelete, setMovieToDelete] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [filters, setFilters] = useState({
        keyword: '',
        movieStatus: '',
        genreIds: [],
    });

    // Debounced fetch để tránh spam API
    const [debouncedFilters] = useDebounce(filters, 500);

    // Hàm fetch được trừu tượng hóa để tái sử dụng
    const fetchMovies = useCallback(async (page) => {
        console.log(`Đang tải trang: ${page} với filters:`, debouncedFilters);
        try {
            setIsLoading(true);
            setError(null);
            const data = await movieService.getAllMovies(page, 10, debouncedFilters);
            if (data && data.content) {
                setMovies(data.content);
                setTotalPages(data.totalPages || 0);
            } else {
                throw new Error('Response API không hợp lệ');
            }
        } catch (err) {
            setError('Lỗi khi tải danh sách phim.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [debouncedFilters]);
    // useEffect chính để gọi API khi page hoặc filters thay đổi
    useEffect(() => {
        fetchMovies(currentPage);
    }, [currentPage, fetchMovies]);

    // Handler cho filter changes
    const handleFilterChange = useCallback((newFilters) => {
        setFilters(newFilters);
        setCurrentPage(0); // Reset page khi filter thay đổi
    }, []);

    const handleAddMovie = useCallback(async (newMovieData) => {
        try {
            setIsAdding(true);
            setError(null);
            await movieService.createMovie(newMovieData);
            // Refetch ngay lập tức trang đầu để hiển thị phim mới
            await fetchMovies(0);
            setIsAddModalOpen(false);
            setCurrentPage(0); // Cập nhật UI pagination về trang đầu
        } catch (err) {
            setError('Lỗi khi thêm phim mới.');
            console.error(err);
        } finally {
            setIsAdding(false);
        }
    }, [fetchMovies]);

    const handlePageChange = useCallback((pageNumber) => {
        setCurrentPage(pageNumber);
    }, []);

    const handleUpdateMovie = useCallback(async (updatedMovieData) => {
        try {
            setIsUpdating(true);
            setError(null);
            await movieService.updateMovie(updatedMovieData.id, updatedMovieData);
            await fetchMovies(currentPage); // Refetch trang hiện tại ngay lập tức
            setIsEditModalOpen(false);
            setCurrentMovieToEdit(null);
        } catch (err) {
            setError('Đã xảy ra lỗi khi cập nhật phim!');
            console.error(err);
        } finally {
            setIsUpdating(false);
        }
    }, [currentPage, fetchMovies]);

    const handleConfirmDelete = useCallback(async () => {
        if (!movieToDelete) return;
        try {
            setIsDeleting(true);
            setError(null);
            await movieService.deleteMovie(movieToDelete.id);
            // Refetch ngay lập tức trang đầu sau delete
            await fetchMovies(0);
            setCurrentPage(0); // Reset về trang đầu
            setIsDeleteModalOpen(false);
            setMovieToDelete(null);
        } catch (err) {
            setError('Lỗi khi xóa phim.');
            console.error(err);
        } finally {
            setIsDeleting(false);
        }
    }, [movieToDelete, fetchMovies]);

    const handleDeleteClick = useCallback((movie) => {
        setMovieToDelete(movie);
        setIsDeleteModalOpen(true);
    }, []);

    const handleEditClick = useCallback((movie) => {
        setCurrentMovieToEdit(movie);
        setIsEditModalOpen(true);
    }, []);

    const handleCancelDelete = useCallback(() => {
        setIsDeleteModalOpen(false);
        setMovieToDelete(null);
    }, []);

    const renderLoading = () => {
        if (isLoading) {
            return <p>Đang tải danh sách phim...</p>;
        }
        if (error) {
            return <p className="page-error-message">{error}</p>;
        }
        return (
            <MovieTable
                movies={movies}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteClick}
            />
        );
    };

    return (
        <div>
            <div className="page-header">
                <h1>Quản lý Phim</h1>
                <button className="btn-add-new" onClick={() => setIsAddModalOpen(true)}>
                    + Thêm Phim Mới
                </button>
            </div>

            {/* Thêm MovieFilter */}
            <MovieFilter 
                filters={filters} 
                onFilterChange={handleFilterChange} 
            />

            {renderLoading()}

            {!isLoading && totalPages > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}

            {/* Modals giữ nguyên */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Thêm Phim Mới"
            >
                <AddMovieForm
                    onAddMovie={handleAddMovie}
                    onClose={() => setIsAddModalOpen(false)}
                    isLoading={isAdding}
                />
            </Modal>

            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Chỉnh Sửa Phim"
            >
                <EditMovieForm
                    movieToEdit={currentMovieToEdit}
                    onUpdateMovie={handleUpdateMovie}
                    onClose={() => setIsEditModalOpen(false)}
                    isLoading={isUpdating}
                />
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={handleCancelDelete}
                title="Xác nhận Xóa Phim"
            >
                <div className="confirm-delete-content">
                    <p>Bạn có chắc chắn muốn xóa bộ phim
                       <strong> "{movieToDelete?.title}"</strong>?
                       <br/>Hành động này không thể hoàn tác.
                    </p>
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={handleCancelDelete}
                            disabled={isDeleting}
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            className="btn-submit-danger"
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Đang xóa...' : 'Xác nhận Xóa'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MovieListPage;