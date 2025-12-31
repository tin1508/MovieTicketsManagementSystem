import React, { useEffect, useCallback, useState } from 'react';
import { useDebounce } from 'use-debounce';
// 1. Import useNavigate để sửa lỗi
import { useNavigate } from 'react-router-dom';

import MovieTable from '../components/movies/MovieTable';
import AddMovieForm from '../components/movies/AddMovieForm';
import Modal from '../components/common/Modal';
import EditMovieForm from '../components/movies/EditMovieForm';
import * as movieService from '../services/movieService';
import Pagination from '../components/common/Pagination';
import MovieFilter from '../components/movies/MovieFilter';
import UploadPosterForm from '../components/movies/UploadPosterForm';
// 2. Import Form Suất Chiếu
import ShowtimesForm from '../components/showtimes/ShowtimesForm'; 

const MovieListPage = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // State Loading
    const [isAdding, setIsAdding] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // State Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentMovieToEdit, setCurrentMovieToEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [movieToDelete, setMovieToDelete] = useState(null);
    const [movieToUpload, setMovieToUpload] = useState(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    
    // 3. State cho Modal Suất Chiếu
    const [isShowtimeModalOpen, setIsShowtimeModalOpen] = useState(false);
    const [movieToShowtime, setMovieToShowtime] = useState(null);
    
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [filters, setFilters] = useState({
        keyword: '',
        movieStatus: '',
        genreIds: [],
    });

    const [debouncedFilters] = useDebounce(filters, 500);

    // 4. FIX LỖI: Sử dụng useNavigate và đặt tên biến là 'navigate' (tránh trùng navigator)
    const navigate = useNavigate();

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

    useEffect(() => {
        fetchMovies(currentPage);
    }, [currentPage, fetchMovies]);

    const handleFilterChange = useCallback((newFilters) => {
        setFilters(newFilters);
        setCurrentPage(0);
    }, []);

    const handleAddMovie = useCallback(async (newMovieData) => {
        try {
            setIsAdding(true);
            setError(null);
            await movieService.createMovie(newMovieData);
            await fetchMovies(0);
            setIsAddModalOpen(false);
            setCurrentPage(0);
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
            await fetchMovies(currentPage);
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
            await fetchMovies(0);
            setCurrentPage(0);
            setIsDeleteModalOpen(false);
            setMovieToDelete(null);
        } catch (err) {
            const serverMessage = err.response?.data?.message || err.message;
            if(serverMessage !== null){
                alert("KHÔNG THỂ XÓA: Phim này hiện đang có suất chiếu!!!");
            }
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
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

    const handleUploadClick = useCallback((movie) => {
        setMovieToUpload(movie);
        setIsUploadModalOpen(true);
    }, []);

    const handleUploadModalClose = () => {
        setIsUploadModalOpen(false);
        setMovieToUpload(null);
    };

    const handleUploadSubmit = async (file) => {
        if (!movieToUpload) return;
        setIsUploading(true);
        setError(null);
        try {
            await movieService.uploadPoster(movieToUpload.id, file);
            await fetchMovies(currentPage); 
            handleUploadModalClose();
        } catch (err) {
            setError('Lỗi khi tải poster. Vui lòng thử lại.');
        } finally {
            setIsUploading(false);
        }
    };

    // 5. FIX LOGIC: Hàm này giờ sẽ Mở Modal Add Showtimes thay vì chuyển trang
    const handleViewShowtimes = useCallback((movie) => {
        // Cũ: navigator(...) -> Gây lỗi và chuyển trang
        // Mới: Mở Modal thêm lịch luôn
        setMovieToShowtime(movie);
        setIsShowtimeModalOpen(true);
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
                onUploadClick={handleUploadClick}
                onViewShowtimes={handleViewShowtimes} // Nút "Lịch chiếu" giờ gọi hàm mở modal
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

            {/* Các Modal cũ */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} customClass="modal-wide" title="Thêm Phim Mới">
                <AddMovieForm onAddMovie={handleAddMovie} onClose={() => setIsAddModalOpen(false)} isLoading={isAdding} />
            </Modal>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} customClass="modal-wide" title="Chỉnh Sửa Phim">
                <EditMovieForm movieToEdit={currentMovieToEdit} onUpdateMovie={handleUpdateMovie} onClose={() => setIsEditModalOpen(false)} isLoading={isUpdating} />
            </Modal>

            <Modal isOpen={isUploadModalOpen} onClose={handleUploadModalClose} title="Tải lên Poster">
                <UploadPosterForm movie={movieToUpload} onClose={handleUploadModalClose} onUploadSuccess={handleUploadSubmit} isLoading={isUploading} />
            </Modal>

            {/* 6. Thêm Modal Suất Chiếu vào JSX */}
            <Modal
                isOpen={isShowtimeModalOpen}
                onClose={() => setIsShowtimeModalOpen(false)}
                title={`Thêm Suất Chiếu`}
                customClass="modal-wide"
            >
                {movieToShowtime && (
                    <ShowtimesForm 
                        moviePreSelected={movieToShowtime}
                        onSuccess={() => setIsShowtimeModalOpen(false)}
                        onCancel={() => setIsShowtimeModalOpen(false)}
                    />
                )}
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={handleCancelDelete} title="Xác nhận Xóa Phim">
                <div className="confirm-delete-content">
                    <p>Bạn có chắc chắn muốn xóa bộ phim
                       <strong> "{movieToDelete?.title}"</strong>?
                       <br/>Hành động này không thể hoàn tác.
                    </p>
                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={handleCancelDelete} disabled={isDeleting}>
                            Hủy
                        </button>
                        <button type="button" className="btn-submit-danger" onClick={handleConfirmDelete} disabled={isDeleting}>
                            {isDeleting ? 'Đang xóa...' : 'Xác nhận Xóa'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MovieListPage;