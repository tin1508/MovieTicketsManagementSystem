import React, { useState, useEffect, useRef } from 'react';
import '../../styles/MovieListPage.css'; // Tái sử dụng CSS
import { getAllGenres } from '../../services/genreService';

const EditMovieForm = ({ movieToEdit, onUpdateMovie, onClose }) => {
    // State cho các trường input
    const [title, setTitle] = useState('');
    const [director, setDirector] = useState('');
    const [description, setDescription] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [duration, setDuration] = useState('');
    const [movieStatus, setMovieStatus] = useState('Sắp chiếu');
    const [ageRating, setAgeRating] = useState('T13');
    const [allGenres, setAllGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState(new Set());
    const [error, setError] = useState('');

    const [isGenresDropDownOpen, setIsGenresDropdownOpen] = useState(false);
    const genreRef = React.useRef(null);

    useEffect(() => {  
        const fetchGenres = async () => {
            try {
                const genresData = await getAllGenres();
                setAllGenres(genresData.result || []);
            } catch (err) {
                console.error('Lỗi khi tải thể loại:', err);
                setError('Lỗi khi tải thể loại phim.');
            }
        }
        fetchGenres();
    }, []);

    // 1. Sử dụng useEffect để "điền" dữ liệu vào form khi component được tải
    //    với thông tin của `movieToEdit`
    useEffect(() => {
        if (movieToEdit) {
            setTitle(movieToEdit.title || '');
            setDirector(movieToEdit.director || '');
            setDescription(movieToEdit.description || ''); 
            setReleaseDate((movieToEdit.releaseDate || '').split('T')[0]); // Chỉ lấy phần ngày
            setDuration(movieToEdit.duration || '');
            setMovieStatus(movieToEdit.movieStatus || 'COMING_SOON');
            setAgeRating(movieToEdit.ageRating || 'T13');
            if (movieToEdit.genres && Array.isArray(movieToEdit.genres)) {
                const genreIds = movieToEdit.genres.map(genre => genre.id);
                setSelectedGenres(new Set(genreIds));  
            }
        }
    }, [movieToEdit]); // Hook này sẽ chạy lại mỗi khi `movieToEdit` thay đổi

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (genreRef.current && !genreRef.current.contains(event.target)) {
                setIsGenresDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [genreRef]);

    const handleGenreChange = (genreId) => {
        const newSelectedGenres = new Set(selectedGenres);
        if (newSelectedGenres.has(genreId)) {
            newSelectedGenres.delete(genreId); 
        } else {
            newSelectedGenres.add(genreId);
        }
        setSelectedGenres(newSelectedGenres);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        const numericDuration = parseInt(duration);
        if (isNaN(numericDuration) || numericDuration <= 0) {
            setError('Vui lòng nhập thời lượng hợp lệ.');
            return;
        }
        if (selectedGenres.size === 0) {
            setError('Vui lòng chọn ít nhất một thể loại.');
            return;
        }
        const updatedMovie = {
            id: movieToEdit.id,
            title, director, description, releaseDate,
            duration: numericDuration,
            movieStatus, ageRating,
            genreIds: Array.from(selectedGenres),
        };
        onUpdateMovie(updatedMovie); // Gửi dữ liệu phim đã cập nhật ra ngoài
    };

    return (
        <form onSubmit={handleSubmit} className="add-movie-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
                <label>Tên phim</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Đạo diễn</label>
                <input type="text" value={director} onChange={(e) => setDirector(e.target.value)} required />
            </div>
            <div className="form-group">
                <label>Mô tả</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Ngày phát hành</label>
                <input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Thời lượng (phút)</label>
                <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Ví dụ 120" /> 
            </div>
            <div className="form-group">
                <label>Trạng thái</label>
                <select value={movieStatus} onChange={(e) => setMovieStatus(e.target.value)}>
                    <option value="COMING_SOON">Sắp chiếu</option>
                    <option value="NOW_SHOWING">Đang chiếu</option>
                    <option value="ENDED">Đã chiếu</option>
                </select>
            </div>
            <div className="form-group">
                <label>Xếp hạng độ tuổi</label>
                <select value={ageRating} onChange={(e) => setAgeRating(e.target.value)}>
                    <option value="P">P (Mọi lứa tuổi)</option>
                    <option value="K">K (Dưới 13 tuổi xem cùng cha mẹ)</option>
                    <option value="T13">T13 (13+)</option>
                    <option value="T16">T16 (16+)</option>
                    <option value="T18">T18 (18+)</option>
                </select>
            </div>
            <div className="form-group" ref={genreRef}>
                <label>Thể loại (Chọn ít nhất 1)</label>
                <div 
                    className="genre-select-trigger" 
                    onClick={() => setIsGenresDropdownOpen (!isGenresDropDownOpen)}
                >
                    {selectedGenres.size === 0 
                        ? "Chọn thể loại..." 
                        : `Đã chọn ${selectedGenres.size} thể loại`}
                    <span className="dropdown-arrow">{isGenresDropDownOpen ? '▲' : '▼'}</span>
                </div>

                {isGenresDropDownOpen && (
                    <div className="genre-checkbox-group">
                        {allGenres.length > 0 ? allGenres.map((genre) => (
                            <div key={genre.id} className="genre-checkbox-item">
                                <input
                                    type="checkbox"
                                    id ={`edit-genre-${genre.id}`} // Thêm "edit-" để tránh trùng ID
                                    checked={selectedGenres.has(genre.id)} // TỰ ĐỘNG CHECK
                                    onChange={() => handleGenreChange(genre.id)}
                                />
                                <label htmlFor={`edit-genre-${genre.id}`}>{genre.name}</label>
                            </div>
                        )) : <p>Đang tải thể loại...</p>}
                    </div>
                )}
            </div>
            <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
                <button type="submit" className="btn-submit">Cập Nhật</button>
            </div>
        </form>
    );
};

export default EditMovieForm;