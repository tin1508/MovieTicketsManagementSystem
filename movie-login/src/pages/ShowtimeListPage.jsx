import React, {useEffect, useState} from 'react';
import { listShowtimes, deleteShowtime } from '../services/ShowtimesService';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/ShowtimesListPage.css';
// IMPORT THÊM CÁC ICON CẦN THIẾT
import { FaEdit, FaTrash, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export const SHOWTIME_STATUSES = [
    {value: 'SCHEDULED', label: 'Đã lên lịch'},
    {value: 'NOW_SHOWING', label: 'Đang chiếu'},
    {value: 'ENDED', label: 'Đã kết thúc'},
    {value: 'CANCELLED', label: 'Đã hủy'}
]

export const formatDate = (isDate) => {
    if(!isDate) return '';
    const [year, month, day] = isDate.split('-');
    return `${day}-${month}-${year}`;
};

const ShowtimeListPage = () =>{
    const [allShowtimes, setAllShowtimes] = useState([]); 
    const [filteredShowtimes, setFilteredShowtimes] = useState([]); 
    const [uniqueRooms, setUniqueRooms] = useState([]); 
    const [filters, setFilters] = useState({
        keyword: '', 
        status: '',  
        roomName: '',  
        date: '', 
    });

    // --- 1. STATE QUẢN LÝ THÔNG BÁO (MODAL) ---
    const [notification, setNotification] = useState({
        show: false,
        type: '',       // 'confirm', 'success', 'error'
        message: '',
        title: '',
        dataId: null    // Lưu ID suất chiếu cần xóa
    });

    const navigator = useNavigate();
    const location = useLocation();
    const pagrams = new URLSearchParams(location.search);
    const movieId = pagrams.get("movieId");
    const movieTitle = pagrams.get("movieTitle");

    const fetchShowtimes = () => {
        listShowtimes().then((response)=>{
            const data = response.data.result;
            if(data){
                setAllShowtimes(data);
                setFilteredShowtimes(data); 
                const rooms = [...new Set(data.map(item => item.room.name).filter(Boolean))].sort();
                setUniqueRooms(rooms);
            }
            else setAllShowtimes([]);
        }).catch(error => {
            console.error("Error fetching showtimes:", error);
            setAllShowtimes([]);
        })
    };

    useEffect(()=>{
        fetchShowtimes();
    }, [])

    useEffect(() => {
        if (movieId) {
            setFilters(prev => ({ ...prev, keyword: movieTitle }));
        } else{
            setFilters(prev => ({ ...prev, keyword: '' }));
        }
    }, [movieTitle]);

    useEffect(() => {
        let currentFilteredData = allShowtimes.filter(showtime => {
            const movieTitle = showtime.movie?.title?.toLowerCase() || "";
            const showtimeStatus = showtime.status || "";
            const showtimeRoomName = showtime.room?.name || "";
            const showtimeDate = showtime.showtimesDate || "";

            const keywordMatch = !filters.keyword || movieTitle.includes(filters.keyword.toLowerCase());
            const statusMatch = !filters.status || showtimeStatus === filters.status;
            const roomMatch = !filters.roomName || showtimeRoomName === filters.roomName;
            const dateMatch = !filters.date || showtimeDate === filters.date;
            
            return keywordMatch && statusMatch && roomMatch && dateMatch;
        });

        setFilteredShowtimes(currentFilteredData);
    }, [filters, allShowtimes]);

    const handleFilterChange = (event) => {
        const {name, value} = event.target;
        setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
    }

    const handleClearFilters = () => {
        setFilters({
            keyword: '',
            status: '',
            roomName: '',
            date: '',
        })
    }

    function addNewShowtime(){
        navigator(`/dashboard/showtimes/add?movieId=${movieId}&movieTitle=${encodeURIComponent(movieTitle)}`);
    }

    function updateShowtime(id){
        navigator(`/dashboard/edit-showtimes/${id}`)
    }

    // --- 2. HÀM HELPER ĐỂ HIỆN THÔNG BÁO ---
    const showNotification = (type, title, message) => {
        setNotification({
            show: true,
            type: type,
            title: title,
            message: message,
            dataId: null
        });
    }

    const closeNotification = () => {
        setNotification({ ...notification, show: false });
    }

    // --- 3. SỬA HÀM XÓA: MỞ MODAL XÁC NHẬN ---
    function removeShowtime(id){
        setNotification({
            show: true,
            type: 'confirm',
            title: 'Xác nhận xóa',
            message: 'Bạn có chắc chắn muốn xóa suất chiếu này không? Hành động này không thể hoàn tác.',
            dataId: id // Lưu ID để xóa sau khi bấm Đồng ý
        });
    }

    // --- 4. HÀM THỰC HIỆN XÓA (KHI BẤM ĐỒNG Ý TRONG MODAL) ---
    const confirmDelete = () => {
        const idToDelete = notification.dataId;
        closeNotification(); // Đóng modal xác nhận

        if (idToDelete) {
            deleteShowtime(idToDelete).then((response) => {
                fetchShowtimes();
                // Hiện thông báo thành công
                showNotification('success', 'Thành công', 'Đã xóa suất chiếu khỏi hệ thống!');
            }).catch(error =>{
                console.log(error);
                // Hiện thông báo lỗi
                const errorMsg = error.response?.data?.message || "Có lỗi xảy ra khi xóa!";
                showNotification('error', 'Lỗi', errorMsg);
            })
        }
    };

    const renderStatusBadge = (status) => {
        const statusConfig = SHOWTIME_STATUSES.find(s => s.value === status);
        const label = statusConfig ? statusConfig.label : status;
        let badgeClass = 'status-badge';
        
        switch (status) {
            case 'SCHEDULED': badgeClass += ' status-scheduled'; break;
            case 'NOW_SHOWING': badgeClass += ' status-showing'; break;
            case 'ENDED': badgeClass += ' status-ended'; break;
            case 'CANCELLED': badgeClass += ' status-cancelled'; break;
            default: badgeClass += ' status-default';
        }

        return <span className={badgeClass}>{label}</span>;
    };

    return (
        <div className='container'>
            {movieId && movieTitle && (
                <div className="showtimes-page-header">
                    <h2>Quản lý Lịch Chiếu của phim: <strong>{movieTitle}</strong></h2>
                    <button className='showtimes-btn-add-new' onClick={addNewShowtime}>Thêm Suất Chiếu Mới</button>
                </div>
            )}
            {!movieId && !movieTitle && (
                <div className="showtimes-page-header">
                    <h2>Quản lý Lịch Chiếu </h2>
                </div>
            )}
            
            {/* --- Filter Section --- */}
            <div className='showtimes-filter-bar-container'>
                <div className='showtimes-filer-bar'>
                    {!movieId && (<input placeholder='Tìm theo tên phim...' className='showtimes-filter-input' type='text' name='keyword'
                    value={filters.keyword} onChange={handleFilterChange}/> )}
                    
                    <select name='roomName' className='showtimes-filter-select' value={filters.roomName} onChange={handleFilterChange} style={{marginLeft: '10px'}}>
                        <option value=''>Tất cả phòng</option>
                        {uniqueRooms.map(room => (
                            <option key={room} value={room}>{room}</option>
                        ))}
                    </select>
                    <select name='status' className='showtimes-filter-select' value={filters.status} onChange={handleFilterChange} style={{marginLeft: '10px'}}>
                        <option value=''>Tất cả trạng thái</option>
                        {SHOWTIME_STATUSES.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                    <input className='showtimes-filter-select showtimes-filter-date'
                            type='date'
                            name='date'
                            value={filters.date}
                            onChange={handleFilterChange}
                            data-date={formatDate(filters.date)}
                            title="Chọn ngày chiếu"
                            style={{marginLeft: '10px'}}
                    />
                    <button type='button' className='showtimes-clear-filter-button' onClick={handleClearFilters} style={{marginLeft: '15px'}}>
                        Bỏ lọc
                    </button>
                </div>
            </div>

            {/* --- Table Section --- */}
            <div>
                <table className='table-container'>
                    <thead>
                        <tr>
                            <th>Tên Phòng</th>
                            <th>Tên Phim</th>
                            <th>Giờ Bắt Đầu</th>
                            <th>Giờ Kết Thúc</th>
                            <th>Trạng Thái</th>
                            <th>Ngày Chiếu</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredShowtimes?.map(showtime =>
                                <tr key={showtime.id}>
                                    <td>{showtime.room?.name || "N/A"}</td>
                                    <td>{showtime.movie?.title || "N/A"}</td>
                                    <td>{showtime.startTime}</td>
                                    <td>{showtime.endTime}</td>
                                    <td>{renderStatusBadge(showtime.status)}</td>
                                    <td>{formatDate(showtime.showtimesDate)}</td>
                                    <td className="showtimes-action-cell">
                                        <div className="showtimes-action-buttons">
                                            <button 
                                                className="showtimes-btn-icon showtimes-btn-edit" 
                                                title="Cập nhật"
                                                onClick={() => updateShowtime(showtime.id)} 
                                            >
                                                <FaEdit />
                                            </button>
                                            <button 
                                                className="showtimes-btn-icon showtimes-btn-delete" 
                                                title="Xóa"
                                                onClick={() => removeShowtime(showtime.id)} 
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
                {filteredShowtimes.length === 0 && (
                    <p style={{textAlign: 'center', color: '#999', padding: '20px'}}>Không tìm thấy suất chiếu</p>
                )}
            </div>

            {/* --- 5. RENDER MODAL THÔNG BÁO --- */}
            {notification.show && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
                            {notification.type === 'confirm' && <FaExclamationTriangle color="#f0ad4e" />}
                            {notification.type === 'success' && <FaCheckCircle color="#28a745" />}
                            {notification.type === 'error' && <FaTimesCircle color="#dc3545" />}
                        </div>

                        <h3 className="modal-title">{notification.title}</h3>
                        <p className="modal-message">{notification.message}</p>

                        <div className="modal-actions">
                            {notification.type === 'confirm' ? (
                                <>
                                    <button className="btn-modal btn-cancel" onClick={closeNotification}>Hủy bỏ</button>
                                    <button className="btn-modal btn-confirm" onClick={confirmDelete}>Đồng ý xóa</button>
                                </>
                            ) : (
                            <button className="btn-modal btn-close-modal" onClick={closeNotification}>Đóng</button>)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default ShowtimeListPage;