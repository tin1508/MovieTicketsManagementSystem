import React, { useState, useEffect } from 'react';
import '../../styles/MovieListPage.css'; // Tái sử dụng CSS

const EditMovieForm = ({ movieToEdit, onUpdateMovie, onClose }) => {
    // State cho các trường input
    const [title, setTitle] = useState('');
    const [director, setDirector] = useState('');
    const [genre, setGenre] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [status, setStatus] = useState('Sắp chiếu');

    // 1. Sử dụng useEffect để "điền" dữ liệu vào form khi component được tải
    //    với thông tin của `movieToEdit`
    useEffect(() => {
        if (movieToEdit) {
            setTitle(movieToEdit.title);
            setDirector(movieToEdit.director);
            setGenre(movieToEdit.genre || '');
            // Định dạng lại ngày tháng cho input type="date" (YYYY-MM-DD)
            setReleaseDate(movieToEdit.releaseDate ? movieToEdit.releaseDate.split('T')[0] : '');
            setStatus(movieToEdit.status);
        }
    }, [movieToEdit]); // Hook này sẽ chạy lại mỗi khi `movieToEdit` thay đổi

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedMovie = {
            ...movieToEdit, // Giữ lại ID và các thông tin cũ
            title,          // Cập nhật các thông tin mới
            director,
            genre,
            releaseDate,
            status
        };

        onUpdateMovie(updatedMovie); // Gửi phim đã cập nhật ra ngoài
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
                <button type="submit" className="btn-submit">Cập Nhật</button>
            </div>
        </form>
    );
};

export default EditMovieForm;