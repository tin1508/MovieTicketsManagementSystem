import React, {useEffect, useState} from 'react';
import { listShowtimes, deleteShowtime } from '../services/ShowtimesService';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/ShowtimesListPage.css';
import { FaEdit, FaTrash } from 'react-icons/fa';


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
    const [allShowtimes, setAllShowtimes] = useState([]); // Original, unfiltered data
    const [filteredShowtimes, setFilteredShowtimes] = useState([]); // Data displayed in the table
    const [uniqueRooms, setUniqueRooms] = useState([]); // List of unique Room IDs for the dropdown
    const [filters, setFilters] = useState({
        keyword: '', // Movie Name search
        status: '',  // Status dropdown value
        roomName: '',  // Room dropdown value
        date: '', 
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
                setFilteredShowtimes(data); // Reset filter on fresh fetch
                const rooms = [...new Set(data.map(item => item.room.name).filter(Boolean))].sort();
                setUniqueRooms(rooms);
            }
            else setAllShowtimes([]);
        }).catch(error => {
            console.error("Error fetching showtimes:", error);
            setAllShowtimes([]);
            setLoading(false);
        })
    };

    useEffect(()=>{
        fetchShowtimes();
        
    }, [])
    useEffect(() => {
        if (movieId) {
            setFilters(prev => ({
                ...prev,
                keyword: movieTitle
            }));
        }
        else{
            setFilters(prev => ({
                ...prev,
                keyword: ''
            }));
        }
    }, [movieTitle]);
    useEffect(() => {
        let currentFilteredData = allShowtimes.filter(showtime => {
            const movieTitle = showtime.movie?.title?.toLowerCase() || "";
            const showtimeStatus = showtime.status || "";
            const showtimeRoomName = showtime.room?.name || "";
            const showtimeDate = showtime.showtimesDate || "";

            // 1. Keyword Filter (Movie Name)
            const keywordMatch = !filters.keyword || movieTitle.includes(filters.keyword.toLowerCase());

            // 2. Status Filter
            const statusMatch = !filters.status || showtimeStatus === filters.status;

            // 3. Room ID Filter
           const roomMatch = !filters.roomName || showtimeRoomName === filters.roomName;

            //4. date filter
            const dateMatch = !filters.date ||showtimeDate === filters.date;
            return keywordMatch && statusMatch && roomMatch && dateMatch;
        });

        setFilteredShowtimes(currentFilteredData);
    }, [filters, allShowtimes]);
    //handle filter changes
    const handleFilterChange = (event) => {
        const {name, value} = event.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    }
    //clear filters
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
    function removeShowtime(id){
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa suất chiếu này không?");
        if(!isConfirmed) return;
        deleteShowtime(id).then((response) => {
            fetchShowtimes();
            alert("Xóa suất chiếu thành công!!!")
        }).catch(error =>{
            console.log(error);
            alert("Có lỗi xảy ra!")
        })
    }
    const renderStatusBadge = (status) => {
        const statusConfig = SHOWTIME_STATUSES.find(s => s.value === status);
        const label = statusConfig ? statusConfig.label : status;

        let badgeClass = 'status-badge';
        
        switch (status) {
            case 'SCHEDULED':
                badgeClass += ' status-scheduled'; // Blue/Info
                break;
            case 'NOW_SHOWING':
                badgeClass += ' status-showing';   // Green/Success
                break;
            case 'ENDED':
                badgeClass += ' status-ended';     // Grey/Secondary
                break;
            case 'CANCELLED':
                badgeClass += ' status-cancelled'; // Red/Danger
                break;
            default:
                badgeClass += ' status-default';
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
            <div className='showtimes-filter-bar-container'>
                <div className='showtimes-filer-bar'>
                    {!movieId && (<input placeholder='Tìm theo tên phim...' className='showtimes-filter-input' type='text' name='keyword'
                    value={filters.keyword} onChange={handleFilterChange}/> )}
                    {/*select room ID */}
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
                            data-placeholder="dd/mm/yyyy"
                            style={{marginLeft: '10px'}}
                    />
                    {/*nút xóa filter*/}
                    <button
                        type='button'
                        className='showtimes-clear-filter-button'
                        onClick={handleClearFilters}
                        style={{marginLeft: '15px'}}
                    >
                        Bỏ lọc
                    </button>
                </div>
            </div>
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
                        {
                            filteredShowtimes?.map(showtime =>
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
        </div>
    )
}
export default ShowtimeListPage;