import React, { useState, useEffect, useRef } from 'react';
import * as genreService from '../../services/genreService';

const MOVIE_STATUSES = [
    { value: 'NOW_SHOWING', label: 'Đang chiếu' },
    { value: 'COMING_SOON', label: 'Sắp chiếu' },
    { value: 'ENDED', label: 'Đã ngừng' },
];

// Component đa lựa chọn thể loại (Multi-select)
const GenreFilterDropdown = ({ allGenres, selectedGenreIds = [], onGenreChange, isLoading }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Xử lý việc đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Xử lý khi check/uncheck một thể loại
    const handleCheckboxChange = (genreId) => {
        // Tạo một mảng Set để dễ dàng thêm/xóa
        const newGenreIdsSet = new Set(selectedGenreIds);
        
        if (newGenreIdsSet.has(genreId)) {
            newGenreIdsSet.delete(genreId); // Bỏ chọn
        } else {
            newGenreIdsSet.add(genreId); // Chọn
        }
        
        // Chuyển lại thành mảng và gọi hàm của component cha
        onGenreChange(Array.from(newGenreIdsSet));
    };

    // Hiển thị text cho nút bấm
    const getTriggerText = () => {
        if (isLoading) return 'Đang tải thể loại...';
        if (selectedGenreIds.length === 0) return 'Tất cả thể loại';
        if (selectedGenreIds.length === 1) return '1 thể loại đã chọn';
        return `${selectedGenreIds.length} thể loại đã chọn`;
    };

    return (
        // Thêm div này để định vị dropdown (position: relative)
        <div className="filter-group-relative" ref={dropdownRef}>
            <button
                type="button"
                className="genre-select-trigger" // Tái sử dụng class của bạn
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading}
            >
                <span>{getTriggerText()}</span>
                <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div className="genre-checkbox-group"> {/* Tái sử dụng class của bạn */}
                    {allGenres.map((genre) => (
                        <div key={genre.id} className="genre-checkbox-item">
                            <input
                                type="checkbox"
                                id={`filter-genre-${genre.id}`}
                                checked={selectedGenreIds.includes(genre.id)}
                                onChange={() => handleCheckboxChange(genre.id)}
                            />
                            <label htmlFor={`filter-genre-${genre.id}`}>
                                {genre.name}
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


// Component Filter chính
const MovieFilter = ({ filters, onFilterChange }) => {
    const [genres, setGenres] = useState([]);
    const [isLoadingGenres, setIsLoadingGenres] = useState(false);

    useEffect(() => {
        const fetchGenres = async () => {
            setIsLoadingGenres(true);
            try {
                // Giả sử service này trả về: { code: 1000, result: [...] }
                const data = await genreService.getAllGenres();
                
                // KIỂM TRA MỚI: Kiểm tra xem data.result có phải là mảng không
                if (data && Array.isArray(data.result)) {
                    setGenres(data.result); // <-- Lấy mảng từ data.result
                } 
                // Giữ lại các kiểm tra cũ phòng trường hợp API khác
                else if (Array.isArray(data)) {
                    setGenres(data);
                } else if (data && Array.isArray(data.content)) {
                    setGenres(data.content);
                } 
                // Nếu không tìm thấy
                else {
                    console.warn('API thể loại không trả về mảng ở .result hoặc .content:', data);
                    setGenres([]); 
                }
            } catch (error) {
                console.error('Lỗi khi tải danh sách thể loại:', error);
                setGenres([]); // Đặt là mảng rỗng nếu có lỗi
            } finally {
                setIsLoadingGenres(false);
            }
        };

        fetchGenres();
    }, []);
    // Handler cho input (keyword) và select (status)
    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({
            ...filters,
            [name]: value,
        });
    };

    // Handler riêng cho mảng genreIds
    const handleGenreChange = (newGenreIds) => {
        onFilterChange({
            ...filters,
            genreIds: newGenreIds,
        });
    };

    // Xóa filter (cập nhật cho genreIds)
    const handleClearFilters = () => {
        onFilterChange({
            keyword: '',
            movieStatus: '',
            genreIds: [], // <-- Cập nhật
        });
    };

    return (
        <div className="filter-bar">
            {/* Filter theo từ khóa */}
            <input
                type="text"
                name="keyword"
                placeholder="Tìm theo tên phim..."
                value={filters.keyword}
                onChange={handleChange}
                className="filter-input"
            />

            {/* Filter theo Trạng thái */}
            <select
                name="movieStatus"
                value={filters.movieStatus}
                onChange={handleChange}
                className="filter-select"
            >
                <option value="">Tất cả trạng thái</option>
                {MOVIE_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                        {status.label}
                    </option>
                ))}
            </select>

            {/* Filter theo Thể loại (ĐA LỰA CHỌN) */}
            <GenreFilterDropdown
                allGenres={genres}
                selectedGenreIds={filters.genreIds} // Truyền mảng ID đã chọn
                onGenreChange={handleGenreChange} // Hàm callback mới
                isLoading={isLoadingGenres}
            />

            {/* Nút Xóa Filter */}
            <button 
                onClick={handleClearFilters} 
                className="btn-filter-clear"
            >
                Xóa Filter
            </button>
        </div>
    );
};

export default MovieFilter;