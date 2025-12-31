import React, { useEffect, useRef, useState } from 'react';
import '../../styles/MovieListPage.css'; 
import { getAllGenres } from '../../services/genreService';

const AddMovieForm = ({ onAddMovie, onClose }) => {
    const [title, setTitle] = useState('');
    const [director, setDirector] = useState('');
    const [actors, setActors] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [status, setStatus] = useState('COMING_SOON');
    const [ageRating, setAgeRating] = useState('T13');  
    const [duration, setDuration] = useState('');
    const [selectedGenres, setSelectedGenres] = useState(new Set());
    const [allGenres, setAllGenres] = useState([]);
    const [description, setDescription] = useState('');
    const [trailerUrl, setTrailerUrl] = useState('');
    const [error, setError] = useState('');
    const [isGenresDropDownOpen, setIsGenresDropdownOpen] = useState(false);
    const genreRef = useRef(null);

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
            setError('Vui lòng nhập thời lượng hợp lệ (phải là số > 0).');
            return;
        }
        if(selectedGenres.size === 0) {
            setError('Vui lòng chọn ít nhất một thể loại.');
            return;
        }
        if (status === 'COMING_SOON') {
            if (!releaseDate) {
                setError('Phim "Sắp chiếu" bắt buộc phải có Ngày phát hành.');
                return;
            }
            const today = new Date();
            today.setHours(0, 0, 0, 0); 
            const releaseDateObj = new Date(releaseDate);
            releaseDateObj.setDate(releaseDateObj.getDate() + 1);
            releaseDateObj.setHours(0, 0, 0, 0);
            if (releaseDateObj < today) {
                setError('Ngày phát hành của phim "Sắp chiếu" phải là hôm nay hoặc trong tương lai.');
                return;
            }
        }
        if (!title || !director) {
            alert('Tên phim và Đạo diễn là bắt buộc!');
            return;
        }
        const newMovie = {
            title, director, description, releaseDate,
            movieStatus: status, ageRating, duration: numericDuration,
            actors: actors, genreIds: Array.from(selectedGenres), trailerUrl: trailerUrl,
        };
        onAddMovie(newMovie); 
    };

    return (
        // QUAN TRỌNG: Không còn thẻ h2 title ở đây nữa
        <form onSubmit={handleSubmit} className="add-movie-form wide-form">
            
            {error && <div className="error-message">{error}</div>}

            <div className="form-grid-layout">
                {/* --- CỘT TRÁI --- */}
                <div className="form-column left-col">
                    <div className="form-group">
                        <label>Tên phim <span className="required">*</span></label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Nhập tên phim..." />
                    </div>

                    <div className="form-group">
                        <label>Đạo diễn <span className="required">*</span></label>
                        <input type="text" value={director} onChange={(e) => setDirector(e.target.value)} required placeholder="Tên đạo diễn..." />
                    </div>

                    <div className="form-group">
                        <label>Diễn viên</label>
                        <textarea 
                            value={actors} 
                            onChange={(e) => setActors(e.target.value)} 
                            placeholder="Ví dụ: Trấn Thành, Tuấn Trần..."
                            rows="2"
                        />
                    </div>

                    <div className="form-group full-height">
                        <label>Mô tả nội dung</label>
                        <textarea 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            rows="5" 
                            placeholder="Tóm tắt nội dung phim..."
                        />
                    </div>
                </div>

                {/* --- CỘT PHẢI --- */}
                <div className="form-column right-col">
                    <div className="form-row-2">
                        <div className="form-group">
                            <label>Ngày phát hành</label>
                            <input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
                        </div>
                        <div className='form-group'>
                            <label>Thời lượng (phút)</label>
                            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="VD: 120" min="1" required /> 
                        </div>
                    </div>

                    <div className="form-row-2">
                         <div className="form-group">
                            <label>Trạng thái</label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="COMING_SOON">Sắp chiếu</option>
                                <option value="NOW_SHOWING">Đang chiếu</option>
                                <option value="ENDED">Đã chiếu</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Độ tuổi</label>
                            <select value={ageRating} onChange={(e) => setAgeRating(e.target.value)}>
                                <option value="P">P</option>
                                <option value="K">K (Dưới 13 tuổi)</option>
                                <option value="T13">T13 (13+)</option>
                                <option value="T16">T16 (16+)</option>
                                <option value="T18">T18 (18+)</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Link Trailer (Youtube)</label>
                        <input type="text" value={trailerUrl} onChange={(e) => setTrailerUrl(e.target.value)} placeholder="https://..." />
                    </div>

                    <div className="form-group" ref={genreRef}>
                        <label>Thể loại <span className="required">*</span></label>
                        <div className="genre-select-trigger" onClick={() => setIsGenresDropdownOpen(!isGenresDropDownOpen)}>
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
                                            id={`genre-${genre.id}`}
                                            checked={selectedGenres.has(genre.id)}
                                            onChange={() => handleGenreChange(genre.id)}
                                        />
                                        <label htmlFor={`genre-${genre.id}`}>{genre.name}</label>
                                    </div>
                                )) : <p>Đang tải...</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>Hủy bỏ</button>
                <button type="submit" className="btn-submit">Lưu Phim</button>
            </div>
        </form>
    );
};

export default AddMovieForm;