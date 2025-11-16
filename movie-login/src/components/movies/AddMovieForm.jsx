import React, { useEffect, useRef, useState } from 'react';
import '../../styles/MovieListPage.css'; // Tái sử dụng một số style
import { getAllGenres } from '../../services/genreService';


const AddMovieForm = ({ onAddMovie, onClose }) => {
    const [title, setTitle] = useState('');
    const [director, setDirector] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [status, setStatus] = useState('COMING_SOON');
    const [ageRating, setAgeRating] = useState('T13');  
    const [duration, setDuration] = useState('');
    const [selectedGenres, setSelectedGenres] = useState(new Set());
    const [allGenres, setAllGenres] = useState([]);
    const [description, setDescription] = useState('');
    const [posterUrl, setPosterUrl] = useState('');
    const [trailerUrl, setTrailerUrl] = useState('');
    const [error, setError] = useState('');

    const [isGenresDropDownOpen, setIsGenresDropdownOpen] = useState(false);
    const genreRef = useRef(null);

    useEffect(() => {
        // Giả sử chúng ta có một hàm fetchGenres để lấy danh sách thể loại từ API
        const fetchGenres = async () => {
            try {
                const genresData = await getAllGenres();

                console.log('Thể loại tải về:', genresData);
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
            setError('Vui lòng nhập thời lượng hợp lệ.');
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

            // Tạo đối tượng Date cho ngày hôm nay (chỉ lấy ngày, bỏ qua giờ)
            const today = new Date();
            today.setHours(0, 0, 0, 0); 

            // Tạo đối tượng Date cho ngày phát hành (cần +1 ngày do múi giờ)
            const releaseDateObj = new Date(releaseDate);
            releaseDateObj.setDate(releaseDateObj.getDate() + 1);
            releaseDateObj.setHours(0, 0, 0, 0);

            // So sánh
            if (releaseDateObj < today) {
                setError('Ngày phát hành của phim "Sắp chiếu" phải là hôm nay hoặc trong tương lai.');
                return;
            }
        }

        if (!title || !director) {
            alert('Tên phim và Đạo diễn là bắt buộc!');
            return;
        }

        // Tạo một bộ phim mới
        const newMovie = {
            title,
            director,
            description,
            releaseDate,
            movieStatus: status,
            ageRating,
            duration: numericDuration,
            genreIds: Array.from(selectedGenres),
            trailerUrl: trailerUrl,
        };

        onAddMovie(newMovie); // Gửi dữ liệu phim mới ra ngoài
    };

    return (
        <form onSubmit={handleSubmit} className="add-movie-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
                <label>Tên phim</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="form-group">
                <label>Đạo diễn</label>
                <input type="text" value={director} onChange={(e) => setDirector(e.target.value)} />
            </div>

            <div className="form-group">
                <label>Mô tả</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="form-group">
                <label>Ngày phát hành</label>
                <input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
            </div>

            <div className='form-group'>
                <label>Thời lượng (phút)</label>
                <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Ví dụ 120" /> 
            </div>

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
                    <option value="P">P (Mọi lứa tuổi)</option>
                    <option value="K">K (Dưới 13 tuổi xem cùng cha mẹ)</option>
                    <option value="T13">T13 (13+)</option>
                    <option value="T16">T16 (16+)</option>
                    <option value="T18">T18 (18+)</option> {/* <-- ĐÚNG */}
                </select>
            </div>
                <div className="form-group">
                 <label>Đường dẫn Trailer (Trailer URL)</label>
                 <input 
                    type="text" 
                    value={trailerUrl} 
                    onChange={(e) => setTrailerUrl(e.target.value)} 
                    placeholder="https://youtube.com/watch?v=..."
                />
             </div>

            <div className="form-group" ref={genreRef}>
                <label>Thể loại</label>
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
                                    id ={`genre-${genre.id}`}
                                    checked={selectedGenres.has(genre.id)}
                                    onChange={() => handleGenreChange(genre.id)}
                                />
                                <label htmlFor={`genre-${genre.id}`}>{genre.name}</label>
                            </div>
                        )) : <p>Đang tải thể loại...</p>}
                    </div>
                )}
            </div>

            <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
                <button type="submit" className="btn-submit">Thêm Phim</button>
            </div>
        </form>
    );
};

export default AddMovieForm;