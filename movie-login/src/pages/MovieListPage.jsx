import React, { useEffect } from 'react';
import MovieTable from '../components/movies/MovieTable';
import AddMovieForm from '../components/movies/AddMovieForm';
import Modal from '../components/common/Modal';
import { useState } from 'react';
import EditMovieForm from '../components/movies/EditMovieForm';
import { mockMovies } from '../data/mockMovies';
import * as movieService from '../services/movieService';

const MovieListPage = () => {
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const [isAddModalOpen, setIsAddModalOpen] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentMovieToEdit, setCurrentMovieToEdit] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [movieToDelete, setMovieToDelete] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            console.log('useEffect trong MovieListPage đang chạy!');
            try {
                setIsLoading(true);
                setError(null);
                const data = await movieService.getAllMovies();
                setMovies(data.result);
            } catch (err) {
                setError('Lỗi khi tải danh sách phim.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, []);

    const handleAddMovie = async (newMovieData) => {
        try {
            const newMovie = await movieService.createMovie(newMovieData);
            setMovies([newMovie, ...movies]);
            setIsAddModalOpen(false);
        } catch (err) {
            alert('Lỗi khi thêm phim mới.');
        }
    };

    const handleUpdateMovie = async (updatedMovie) => {
        try {
            const savedMovie = await movieService.updateMovie(updatedMovie.id, updatedMovie);
            setMovies(movies.map(movie =>
                movie.id === savedMovie.id ? savedMovie : movie
            ));
            setIsEditModalOpen(false);
            setCurrentMovieToEdit(null);
        } catch (err) {
            alert('Lỗi khi cập nhật phim.');
        }
    };

    const handleConfirmDelete = async () => {
        if(!movieToDelete) return;
        try {
            await movieService.deleteMovie(movieToDelete.id);
            setMovies(movies.filter(movie => movie.id !== movieToDelete.id));
            setIsDeleteModalOpen(false); 
            setMovieToDelete(null);      
        } catch (err) {
            alert('Lỗi khi xóa phim.');
        }
    };

    const handleDeleteClick = (movie) => {
        setMovieToDelete(movie);    
        setIsDeleteModalOpen(true); 
    };

    const handleEditClick = (movie) => {
        setCurrentMovieToEdit(movie); 
        setIsEditModalOpen(true);   
    };

    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setMovieToDelete(null);
    };

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

            <MovieTable movies={movies} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick}/>

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