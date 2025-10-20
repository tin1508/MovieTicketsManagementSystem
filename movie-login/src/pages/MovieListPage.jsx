import React from 'react';
import MovieTable from '../components/movies/MovieTable';
import AddMovieForm from '../components/movies/AddMovieForm';
import Modal from '../components/common/Modal';
import { useState } from 'react';
import EditMovieForm from '../components/movies/EditMovieForm';
import { mockMovies } from '../data/mockMovies';

const MovieListPage = () => {
    const [movies, setMovies] = useState(mockMovies);

    // State cho modal "Thêm"
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // -- . Thêm state mới cho modal "Sửa" --
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentMovieToEdit, setCurrentMovieToEdit] = useState(null);

    // -- . Thêm state mới cho modal "Xóa" --
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [movieToDelete, setMovieToDelete] = useState(null);

    // Hàm xử lý "Thêm" (giữ nguyên)
    const handleAddMovie = (newMovie) => {
        setMovies([newMovie, ...movies]);
        setIsAddModalOpen(false);
    };

    const handleDeleteClick = (movie) => {
        setMovieToDelete(movie);      // Lưu lại phim nào sắp bị xóa
        setIsDeleteModalOpen(true); // Mở modal xác nhận
    };

    // -- 3. Hàm xử lý khi nhấn nút "Sửa" --
    const handleEditClick = (movie) => {
        setCurrentMovieToEdit(movie); // Lưu phim đang được chọn
        setIsEditModalOpen(true);     // Mở modal Sửa
    };

    const handleConfirmDelete = () => {
        // Dùng .filter() để tạo ra một mảng mới không chứa phim bị xóa
        setMovies(movies.filter(movie => movie.id !== movieToDelete.id));
        setIsDeleteModalOpen(false); // Đóng modal
        setMovieToDelete(null);      // Reset state
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setMovieToDelete(null);
    };

    // -- 4. Hàm xử lý khi submit form "Sửa" --
    const handleUpdateMovie = (updatedMovie) => {
        // Dùng .map() để tạo một mảng mới
        // Nếu tìm thấy phim có id khớp, thay thế nó bằng `updatedMovie`
        // Nếu không, giữ nguyên phim cũ
        setMovies(movies.map(movie => 
            movie.id === updatedMovie.id ? updatedMovie : movie
        ));
        setIsEditModalOpen(false); // Đóng modal Sửa
        setCurrentMovieToEdit(null); // Xóa phim đang chọn
    };


    return (
        <div>
            <div className="page-header">
                <h1>Quản lý Phim</h1>
                <button className="btn-add-new" onClick={() => setIsAddModalOpen(true)}>
                    + Thêm Phim Mới
                </button>
            </div>

            {/* 5. Truyền hàm handleEditClick vào bảng */}
            <MovieTable movies={movies} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick}/>

            {/* Modal Thêm Phim (giữ nguyên) */}
            <Modal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                title="Thêm Phim Mới"
            >
                <AddMovieForm 
                    onAddMovie={handleAddMovie}
                    onClose={() => setIsAddModalOpen(false)}
                />
            </Modal>

            {/* -- 6. Thêm Modal Sửa Phim -- */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Chỉnh Sửa Phim"
            >
                <EditMovieForm
                    movieToEdit={currentMovieToEdit}
                    onUpdateMovie={handleUpdateMovie}
                    onClose={() => setIsEditModalOpen(false)}
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
                            onClick={handleCancelDelete}>
                            Hủy
                        </button>
                        <button 
                            type="button" 
                            className="btn-submit-danger" 
                            onClick={handleConfirmDelete}>
                            Xác nhận Xóa
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MovieListPage;