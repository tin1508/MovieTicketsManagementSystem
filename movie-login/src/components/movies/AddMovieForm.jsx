import React, { useState } from 'react';
import '../../styles/MovieListPage.css'; // Tái sử dụng một số style

const AddMovieForm = ({ onAddMovie, onClose }) => {
    const [title, setTitle] = useState('');
    const [director, setDirector] = useState('');
    const [genre, setGenre] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [status, setStatus] = useState('Sắp chiếu');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !director) {
            alert('Tên phim và Đạo diễn là bắt buộc!');
            return;
        }

        // Tạo một bộ phim mới
        const newMovie = {
            id: `P${Date.now()}`, // Tạo ID tạm thời
            title,
            director,
            genre,
            releaseDate,
            status
        };

        onAddMovie(newMovie); // Gửi dữ liệu phim mới ra ngoài
    };

    return (
        <form onSubmit={handleSubmit} className="add-movie-form">
            <div className="form-group">
                <label>Tên phim</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Đạo diễn</label>
                <input type="text" value={director} onChange={(e) => setDirector(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Thể loại</label>
                <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Ngày phát hành</label>
                <input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Trạng thái</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Sắp chiếu">Sắp chiếu</option>
                    <option value="Đang chiếu">Đang chiếu</option>
                    <option value="Đã chiếu">Đã chiếu</option>
                </select>
            </div>
            <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
                <button type="submit" className="btn-submit">Thêm Phim</button>
            </div>
        </form>
    );
};

export default AddMovieForm;