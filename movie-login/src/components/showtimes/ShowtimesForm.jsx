import React, {useEffect, useState} from 'react';
import '../../styles/ShowtimesListPage.css';
import { listShowtimes, createShowtimes, getShowtimeById, patchShowtime } from '../../services/ShowtimesService';
import {listRooms} from '../../services/RoomsService';
import { listMovies, getMovieById } from '../../services/movieService';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { useNavigate, useParams , useLocation} from 'react-router-dom';
import {formatDate, SHOWTIME_STATUSES} from '../../pages/ShowtimeListPage';
import { TbRuler } from 'react-icons/tb';

const calculateCeilingEndTime = (startTimeStr, durationMinutes) => {
    if (!startTimeStr || !durationMinutes) return "";

    const [h, m] = startTimeStr.split(':').map(Number);
    
    // Start + Duration + 30p dọn dẹp
    let totalMinutes = (h * 60) + m + durationMinutes + 30;

    // Làm tròn lên (Ceiling) cho tròn 10 phút
    // Ví dụ: 11h36 (696p) -> dư 6 -> cộng 4 -> 11h40 (700p)
    const remainder = totalMinutes % 10;
    if (remainder > 0) {
        totalMinutes += (10 - remainder);
    }

    let newH = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;
    
    if(newH >= 24) newH -= 24;

    const formattedH = newH.toString().padStart(2, '0');
    const formattedM = newM.toString().padStart(2, '0');

    return `${formattedH}:${formattedM}`;
};

// Hàm phụ: Đổi giờ "HH:mm" sang số phút để so sánh
const toMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
};
const ShowtimesForm = () => {

    const [allShowtimes, setAllShowtimes] = useState([])
    const [rooms, setRooms] = useState([])
    const [movies, setMovies] = useState([])
    const [roomName, setRoomName] = useState('')
    const [startTime, setStartTime] = useState('')
    const [date, setDate] = useState('')

    const [status, setStatus] = useState('SCHEDULED');

    const [calculatedEndTime, setCalculatedEndTime] = useState('');
    const [filteredShowtimes, setFilteredShowtimes] = useState([]);

    const {id} = useParams();
    const [errorMessage, setErrorMessage] = useState('');


    const navigator = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const movieIdFromUrl = params.get('movieId');
    const movieTitleFromUrl = params.get('movieTitle');
    const [movieId, setMovieId] = useState(movieIdFromUrl || '');
    const [movieName, setMovieName] = useState(movieTitleFromUrl || '');

    const handleRoomName = (e) => setRoomName(e.target.value);
    const handleDate = (e) => setDate(e.target.value);
    const handleStatus = (e) => setStatus(e.target.value);

    useEffect(() =>{
        listShowtimes().then((response)=>{
            if(response?.data?.result) {
                setAllShowtimes(response.data.result);
            }
        }).catch(error => {
            console.error("Error fetching showtimes:", error);
        })
        listRooms().then((response) => {
            const data = response.data.result;
            if (data) {
                const availableRooms = data.filter(room => room.status === 'AVAILABLE');
                setRooms(availableRooms);
            }
            
        }).catch(error => {
            console.error("Error fetching rooms: ", error);
        })
        listMovies().then((response) => {
            const data = response.data.result;
            if(response && data && response.data){
                setMovies(data);
            }
        }).catch(error => {
            console.error("Error loading movies.", error);
        })
    }, [])

    useEffect(()=>{
        if(id){
            getShowtimeById(id).then((response) => {
                const showtime = response.data.result;
                setMovieId(showtime.movie?.id || '');
                setMovieName(showtime.movie?.title || '');
                setRoomName(showtime.room?.name || '')
                setStartTime(showtime.startTime ? showtime.startTime.substring(0, 5) : '');
                setDate(showtime.showtimesDate);
                setStatus(showtime.status || 'SCHEDULED');
            }).catch(error =>{
                console.error("Error fetching showtime details: ", error);
            })
        }
    }, [id]);
    useEffect(() => {
        if(allShowtimes.length > 0 && roomName && date){
            const filtered = allShowtimes.filter(s =>
                s.room?.name === roomName &&
                s.showtimesDate === date &&
                String(s.id) !== String(id)
            );
            filtered.sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
            setFilteredShowtimes(filtered);
        }else{
            setFilteredShowtimes([]);
        }
    }, [allShowtimes, roomName, date, id]);
    useEffect(() => {
        const selectedMovie = movies.find(m => m.title === movieName);
        if (startTime && selectedMovie) {
            const endStr = calculateCeilingEndTime(startTime, selectedMovie.duration);
            setCalculatedEndTime(endStr);
        } else {
            setCalculatedEndTime('');
        }
    }, [startTime, movieName, movies]);
    const timeSlots = React.useMemo(() => {
        const slots = [];
        
        // A. Tạo giờ chẵn (8:00, 9:00...) như cũ
        for (let h = 8; h <= 21; h++) {
            slots.push(`${h.toString().padStart(2, '0')}:00`);
            slots.push(`${h.toString().padStart(2, '0')}:30`);
        }

        // B. THÊM THÔNG MINH: Lấy giờ kết thúc của các suất khác làm giờ bắt đầu gợi ý
        // Giúp lấp đầy khoảng trống như 11:20 -> 14:00
        if (filteredShowtimes && filteredShowtimes.length > 0) {
            filteredShowtimes.forEach(s => {
                if (s.endTime) {
                    // Cắt lấy HH:mm từ endTime (ví dụ 11:20:00 -> 11:20)
                    const endHm = s.endTime.substring(0, 5); 
                    const endMin = toMinutes(endHm);

                    // Chỉ thêm nếu giờ đó nằm trong giờ mở cửa (8h sáng đến 9h tối)
                    // 480 = 8:00, 1260 = 21:00
                    if(endMin >= 480 && endMin <= 1260) { 
                        slots.push(endHm);
                    }
                }
            });
        }

        // C. Lọc trùng và Sắp xếp lại từ sáng đến tối
        const uniqueSlots = [...new Set(slots)];
        uniqueSlots.sort((a, b) => toMinutes(a) - toMinutes(b));

        return uniqueSlots;
    }, [filteredShowtimes]);
    // Thay thế hàm isTimeBlocked cũ bằng hàm này:
    const isRoomBlocked = (slotTimeStr) => {
        const selectedMovie = movies.find(m => m.title === movieName);
        const duration = selectedMovie ? selectedMovie.duration : 120; 
        
        const slotStartMin = toMinutes(slotTimeStr);
        
        // Tính giờ kết thúc dự kiến (bao gồm dọn dẹp + làm tròn)
        let slotEndMin = slotStartMin + duration + 30; 
        const remainder = slotEndMin % 10;
        if (remainder > 0) slotEndMin += (10 - remainder);

        return filteredShowtimes.some(existing => {
            const existingStart = toMinutes(existing.startTime);
            const existingEnd = toMinutes(existing.endTime);

            // LOGIC CHUẨN:
            // Trùng khi: (Mới Bắt Đầu < Cũ Kết Thúc) VÀ (Mới Kết Thúc > Cũ Bắt Đầu)
            // Nếu Mới Kết Thúc == Cũ Bắt Đầu (ví dụ 14:00), điều kiện > sẽ Sai -> Không trùng -> Hợp lệ.
            return slotStartMin < existingEnd && slotEndMin > existingStart;
        });
    };

    const isSameMovieStartingSameTime = (slotTimeStr) => {
        const selectedMovie = movies.find(m => m.title === movieName);
        if(!selectedMovie) return false;
        return allShowtimes.some(s => {
            if(s.showtimesDate !== date) return false;
            if(s.movie?.id !== selectedMovie.id) return false;
            if(String(s.id) === String(id)) return false;

            const existingStartSimple = s.startTime.substring(0, 5);
            if(existingStartSimple === slotTimeStr) return true;
            return false;
        });
    }

    function saveOrUpdateShowtime(e){
        e.preventDefault();
        setErrorMessage('');

    
        const selectedMovie = movies.find(m => m.title === movieName);
        const selectedRoom = rooms.find(r => r.name === roomName);
        if(!selectedMovie || !selectedRoom) {
            setErrorMessage("Dữ liệu không hợp lệ.");
            return;
        }
        if(isRoomBlocked(startTime)) {
             setErrorMessage("❌ Lỗi: Khung giờ này bị trùng với suất chiếu khác (do phim quá dài hoặc phòng đã kín).");
             return;
        }
        const confirmMessage = id ? "Bạn có chắc chắn muốn cập nhật thông tin suất chiếu này không?" : "Bạn có chắc chắc muốn tạo suất chiếu mới này không?";
        const isConfirmed = window.confirm(confirmMessage);
        if(!isConfirmed) return;
        const showtime = {
            movieId: selectedMovie.id,
            roomId: selectedRoom.id, 
            startTime, 
            showtimesDate: date, 
            status
        }
        if(id){
            patchShowtime(id, showtime).then((response) => {
                console.log("Updated: ", response.data.result);
                navigator('/dashboard/showtimes');
            }).catch(err =>{
                setErrorMessage("Error updating showtime");
                console.error(err);
            });
        }
        else{
            if(!movieName || !roomName || !startTime || !date){
                setErrorMessage("Vui lòng điền đẩy đủ thông tin.");
                return;
            }
            createShowtimes(showtime).then((response) =>{
                console.log("Created:", response.data.result);
                alert("Thêm mới thành công!")
                navigator(`/dashboard/showtimes?movieId=${movieId}&movieTitle=${encodeURIComponent(movieName)}`);
            }).catch(err =>{
                setErrorMessage("Error saving showtime");
                console.error(err);
            });
        }
    }
    function pageTitle(){
        const highlightedMovie = <span className="text-warning fst-italic"> {movieName}</span>;

        if(id){
            return <h2 className='text-center'>Cập Nhật Suất Chiếu {highlightedMovie}</h2>
        }
        else{
            return <h2 className='text-center'>Thêm Suất Chiếu {highlightedMovie}</h2> 
        }
    }
    const handleCancel = () =>{
        navigator(`/dashboard/showtimes?movieId=${movieId}&movieTitle=${encodeURIComponent(movieName)}`);
    }
    const todayObj = new Date();
    todayObj.setDate(todayObj.getDate() + 1);
    const tomorrow = todayObj.toISOString().split('T')[0];
    return ( 
        <div className='container mt-4'>
            <div className='row'>
                {/* 3. Added 'form-card-dark' class for custom dark theme */}
                <div className='card col-md-6 offset-md-3 form-card-dark'>
                    <div className="card-header d-flex justify-content-between align-items-center">
                        {
                            pageTitle()
                        }
                    </div>
                    
                    <div className='card-body'>
                        {errorMessage && (
                            <div className="alert alert-danger" role="alert">
                                {errorMessage}
                            </div>
                        )}
                        <form>
                            
                            <div className='form-group mb-3'>
                                <label className='form-label'> Mã Phòng: </label>
                                <select 
                                    className='form-select dark-input'
                                    name='roomName'
                                    value={roomName}
                                    onChange={handleRoomName}
                                >
                                    <option value="">Chọn phòng</option>
                                    {rooms.map((room) => (
                                        <option key={room.id} value={room.name}>
                                            {room.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className='form-group mb-3'>
                                <label className='form-label'> Ngày Chiếu: </label>
                                <input 
                                    className='form-control dark-input showtimes-filter-select showtimes-filter-date'
                                    type='date' 
                                    name='date'
                                    data-date = {formatDate(date)}
                                    value={date}
                                    onChange={handleDate}
                                    data-placeholder = "dd/mm/yyyy"
                                    min={tomorrow}
                                    title='Vui lòng chọn ngày từ ngày mai trở đi'
                                />

                            </div>
                            
                            <div className='form-group mb-3'>
                                <label className='form-label'>Giờ Bắt Đầu:</label>
                                
                                {!roomName || !date || !movieName ? (
                                    <div className="text-warning small fst-italic border p-2 rounded" style={{background: 'rgba(255,193,7,0.1)', borderColor: 'rgba(255,193,7,0.3)'}}>
                                        * Vui lòng chọn <strong>Phòng</strong> và <strong>Ngày</strong> trước để hệ thống tính toán lịch trống.
                                    </div>
                                ) : (
                                    <div className="glass-grid-container p-3" style={{backgroundColor: '#2c3e50', borderRadius: '8px', maxHeight: '300px', overflowY: 'auto'}}>
                                        {filteredShowtimes.length > 0 && (
                                            <div className="mb-2 text-white small">
                                                <strong>Lịch phòng {roomName}: </strong>
                                                {filteredShowtimes.map(s => (
                                                    <span key={s.id} className="badge bg-danger me-1">
                                                        {s.startTime.substring(0,5)} - {s.endTime.substring(0,5)}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="d-flex flex-wrap gap-2">
                                            {timeSlots.map(slot => {
                                                // 1. Check phòng bận
                                                const roomBusy = isRoomBlocked(slot);
                                                // 2. Check phim trùng giờ ở phòng khác
                                                const movieDuplicate = isSameMovieStartingSameTime(slot);

                                                // Block nếu 1 trong 2 điều kiện đúng
                                                const isBlocked = roomBusy || movieDuplicate;
                                                const isSelected = startTime === slot;

                                                // Tạo tooltip message
                                                let titleMsg = "Chọn giờ này";
                                                if (roomBusy) titleMsg = "Phòng này đang bận giờ này";
                                                else if (movieDuplicate) titleMsg = `Phim ${movieName} đã có suất chiếu lúc ${slot} ở phòng khác`;

                                                return (
                                                    <button
                                                        key={slot}
                                                        type="button"
                                                        disabled={isBlocked} 
                                                        onClick={() => setStartTime(slot)}
                                                        className={`btn btn-sm ${isSelected ? 'btn-primary' : (isBlocked ? 'btn-secondary' : 'btn-outline-light')}`}
                                                        style={{
                                                            width: '70px', 
                                                            opacity: isBlocked ? 0.3 : 1, 
                                                            textDecoration: isBlocked ? 'line-through' : 'none'
                                                        }}
                                                        title={titleMsg}
                                                    >
                                                        {slot}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {startTime && (
                                <div className="alert alert-info">
                                    Suất chiếu sẽ kết thúc lúc: <strong>{calculatedEndTime}</strong>
                                </div>
                            )}

                            <div className="d-flex gap-2 justify-content-end mt-4">
                                <button className='btn btn-secondary' onClick={(e) => {e.preventDefault(); handleCancel();}}>Quay lại</button>
                                <button className='btn btn-success' onClick={saveOrUpdateShowtime}>Lưu Suất Chiếu</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowtimesForm;