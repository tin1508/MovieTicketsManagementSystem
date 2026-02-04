import React, {useEffect, useState, useMemo} from 'react';
import '../../styles/ShowtimesListPage.css';
import { listShowtimes, createShowtimes, getShowtimeById, patchShowtime } from '../../services/ShowtimesService';
import { listRooms } from '../../services/RoomsService';
import { getMovieById } from '../../services/movieService'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { useNavigate, useParams , useLocation} from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';

// --- CÁC HÀM HỖ TRỢ ---
const calculateCeilingEndTime = (startTimeStr, durationMinutes) => {
    if (!startTimeStr) return "";
    const duration = durationMinutes || 120; 
    const [h, m] = startTimeStr.split(':').map(Number);
    let totalMinutes = (h * 60) + m + duration + 30; 
    const remainder = totalMinutes % 10;
    if (remainder > 0) totalMinutes += (10 - remainder);
    let newH = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;
    if(newH >= 24) newH -= 24;
    return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
};

const toMinutes = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
};

// 1. NHẬN PROPS TỪ MOVIELISTPAGE
const ShowtimesForm = ({ moviePreSelected, onSuccess, onCancel }) => {
    
    // --- STATE ---
    const [allShowtimes, setAllShowtimes] = useState([])
    const [rooms, setRooms] = useState([])
    const [currentMovie, setCurrentMovie] = useState(null); 
    
    // Form States
    const [roomName, setRoomName] = useState('')
    const [startTime, setStartTime] = useState('')
    const [date, setDate] = useState('')
    const [status, setStatus] = useState('SCHEDULED');

    // Calculated
    const [calculatedEndTime, setCalculatedEndTime] = useState('');
    const [filteredShowtimes, setFilteredShowtimes] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const [notification, setNotification] = useState({
        show: false,
        type: '',       // 'success', 'error', 'confirm'
        message: '',
        title: ''
    });

    // Router
    const {id} = useParams();
    const navigator = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    
    // Fallback: Nếu không có Prop thì mới tìm trên URL
    const urlMovieId = params.get('movieId');

    // Handlers
    const handleRoomName = (e) => setRoomName(e.target.value);
    const handleDate = (e) => {
        setDate(e.target.value);
        setStartTime(''); 
    };

    // 2. LOAD DATA
    useEffect(() => {
        const fetchData = async () => {
            // A. XỬ LÝ PHIM
            if (moviePreSelected) {
                setCurrentMovie(moviePreSelected);
            } 
            else if (urlMovieId) {
                try {
                    const res = await getMovieById(urlMovieId);
                    const movieData = res.result || res.data?.result || res;
                    setCurrentMovie(movieData);
                } catch (error) {
                    console.error("Lỗi tải phim từ URL:", error);
                    setErrorMessage("Không thể tải thông tin phim.");
                }
            }
            else if (!id) {
                setErrorMessage("⚠️ Lỗi: Không xác định được phim.");
            }

            // B. Load Lịch Chiếu & Phòng
            try {
                const [resShows, resRooms] = await Promise.all([listShowtimes(), listRooms()]);
                if (resShows) {
                    const data = Array.isArray(resShows) ? resShows : (resShows.result || resShows.data?.result || []);
                    setAllShowtimes(data);
                }
                if (resRooms) {
                    const data = Array.isArray(resRooms) ? resRooms : (resRooms.result || resRooms.data?.result || []);
                    setRooms(data.filter(r => r.status === 'AVAILABLE'));
                }
            } catch (err) { console.error("Lỗi tải data chung:", err); }
        };
        fetchData();
    }, [moviePreSelected, urlMovieId, id]);

    // 3. Load Detail (Edit Mode)
    useEffect(()=>{
        if(id){
            getShowtimeById(id).then((response) => {
                const showtime = response.result || response.data?.result || response;
                if (showtime) {
                    setRoomName(showtime.room?.name || '')
                    setStartTime(showtime.startTime ? showtime.startTime.substring(0, 5) : '');
                    setDate(showtime.showtimesDate);
                    setStatus(showtime.status || 'SCHEDULED');
                    if (showtime.movie) setCurrentMovie(showtime.movie);
                }
            }).catch(err => console.error(err));
        }
    }, [id]);

    // 4. Filter Showtimes
    useEffect(() => {
        if(allShowtimes.length > 0 && roomName && date){
            const filtered = allShowtimes.filter(s =>
                s.room?.name === roomName &&
                s.showtimesDate === date &&
                String(s.id) !== String(id)
            );
            filtered.sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
            setFilteredShowtimes(filtered);
        } else {
            setFilteredShowtimes([]);
        }
    }, [allShowtimes, roomName, date, id]);

    // 5. Calculate End Time
    useEffect(() => {
        if (startTime) {
            const duration = currentMovie?.duration || 120; 
            const endStr = calculateCeilingEndTime(startTime, duration);
            setCalculatedEndTime(endStr);
        } else {
            setCalculatedEndTime('');
        }
    }, [startTime, currentMovie]);

    const showNotification = (type, title, message) => {
        console.log("Trigger Notification:", type, title);
        setNotification({
            show: true,
            type: type,
            title: title,
            message: message
        });
    }
    const closeNotification = () => {
        const currentType = notification.type;
        setNotification({...notification, show: false });
        if(currentType === 'success'){
            if(onSuccess) onSuccess();
            else navigator('/dashboard/movies');
        }
    }
    // 6. Time Slots
    const timeSlots = useMemo(() => {
        const slots = [];
        for (let h = 8; h <= 21; h++) {
            slots.push(`${h.toString().padStart(2, '0')}:00`);
            slots.push(`${h.toString().padStart(2, '0')}:30`);
        }
        if (filteredShowtimes.length > 0) {
            filteredShowtimes.forEach(s => {
                if (s.endTime) {
                    const endHm = s.endTime.substring(0, 5); 
                    const endMin = toMinutes(endHm);
                    if(endMin >= 480 && endMin <= 1260) slots.push(endHm);
                }
            });
        }
        return [...new Set(slots)].sort((a, b) => toMinutes(a) - toMinutes(b));
    }, [filteredShowtimes]);

    // 7. Validation
    const isRoomBlocked = (slotTimeStr) => {
        const duration = currentMovie ? currentMovie.duration : 120;
        const slotStartMin = toMinutes(slotTimeStr);
        let slotEndMin = slotStartMin + duration + 30; 
        const remainder = slotEndMin % 10;
        if (remainder > 0) slotEndMin += (10 - remainder);

        return filteredShowtimes.some(existing => {
            const existingStart = toMinutes(existing.startTime);
            const existingEnd = toMinutes(existing.endTime);
            return slotStartMin < existingEnd && slotEndMin > existingStart;
        });
    };

    // 8. Submit
    function saveOrUpdateShowtime(e){
        e.preventDefault();
        setErrorMessage('');
        const selectedRoom = rooms.find(r => r.name === roomName);
        
        if(!currentMovie) {
             setErrorMessage("❌ Lỗi: Chưa chọn phim.");
             return;
        }
        if(!selectedRoom) {
            setErrorMessage("Vui lòng chọn Phòng.");
            return;
        }
        if(isRoomBlocked(startTime)) {
             setErrorMessage("❌ Lỗi: Khung giờ này bị trùng.");
             return;
        }
        
        const showtimeData = {
            movieId: currentMovie.id, 
            roomId: selectedRoom.id, 
            startTime, 
            showtimesDate: date, 
            status
        }

        const apiCall = id ? patchShowtime(id, showtimeData) : createShowtimes(showtimeData);
        apiCall.then(() => {
            showNotification('success', 'Thành công', 'Đã lưu lịch chiếu vào hệ thống!');
        }).catch(err => {
            console.error(err);
            const msg = err.response?.data?.message || "Có lỗi xảy ra khi lưu dữ liệu.";
            showNotification('error', 'Lỗi hệ thống', msg);
        });
    }

    function handleCancelAction() { 
        if (onCancel) onCancel();
        else navigator('/dashboard/movies'); 
    }

    const displayMovieName = currentMovie ? currentMovie.title : "Đang tải...";

    return ( 
        <div className='container' style={{maxWidth: '100%'}}>
            <div className='row'>
                <div className='col-12 form-card-dark'> 
                    <div className='card-body p-0'>
                        {errorMessage && <div className="alert alert-danger fw-bold">{errorMessage}</div>}
                        
                        {/* --- HEADER PHIM (Đã sửa lỗi lặp thẻ div và class màu chữ) --- */}
                        <div className="movie-highlight-header">
                            <span className="setup-label">
                                Đang thiết lập lịch chiếu cho
                            </span>
                            
                            <h4 className="movie-title-text">{displayMovieName}</h4>
                            
                            {currentMovie && (
                                <span className="movie-duration-badge">
                                    <i className="bi bi-clock me-1"></i> {currentMovie.duration} phút
                                </span>
                            )}
                        </div>

                        <form>
                            <div className='form-group mb-4'>
                                <label className='form-label'>Phòng Chiếu</label>
                                <select 
                                    className='form-select dark-input'
                                    value={roomName}
                                    onChange={handleRoomName}
                                >
                                    <option value="">-- Chọn phòng --</option>
                                    {rooms.map((room) => (
                                        <option key={room.id} value={room.name}>{room.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className='form-group mb-4'>
                                <label className='form-label'>Ngày Chiếu</label>
                                <input 
                                    className='form-control dark-input'
                                    type='date' 
                                    value={date}
                                    onChange={handleDate}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            
                            <div className='form-group mb-4'>
                                <label className='form-label'>Giờ Bắt Đầu</label>
                                
                                {!roomName || !date ? (
                                    <div className="alert-warning-custom">
                                        <i className="bi bi-info-circle me-2"></i>
                                        Vui lòng chọn <strong>&nbsp;Phòng&nbsp;</strong> và <strong>&nbsp;Ngày&nbsp;</strong> để xem lịch trống.
                                    </div>
                                ) : (
                                    <div className="glass-grid-container">
                                        {filteredShowtimes.length > 0 && (
                                            <div className="mb-3 pb-2 border-bottom border-secondary text-white small">
                                                <strong style={{color:'#ef5350'}}>Đã có lịch: </strong>
                                                {filteredShowtimes.map(s => (
                                                    <span key={s.id} className="badge bg-secondary me-1 opacity-75">
                                                        {s.startTime.substring(0,5)}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="d-flex flex-wrap gap-2 justify-content-center">
                                            {timeSlots.map(slot => {
                                                const roomBusy = isRoomBlocked(slot);
                                                const isBlocked = roomBusy;
                                                const isSelected = startTime === slot;
                                                
                                                return (
                                                    <button
                                                        key={slot}
                                                        type="button"
                                                        disabled={isBlocked} 
                                                        onClick={() => setStartTime(slot)}
                                                        className={`btn ${isSelected ? 'btn-primary' : 'btn-outline-light'}`}
                                                        style={{ width: '80px', height: '40px', textDecoration: isBlocked ? 'line-through' : 'none', opacity: isBlocked ? 0.3 : 1 }}
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
                                <div className="alert-info-custom d-flex justify-content-between align-items-center">
                                    <span><i className="bi bi-play-circle"></i> Bắt đầu: <strong>{startTime}</strong></span>
                                    <span style={{fontSize:'1.2rem'}}>➝</span>
                                    <span>Kết thúc: <strong>{calculatedEndTime}</strong> <i className="bi bi-stop-circle"></i></span>
                                </div>
                            )}

                            <div className="d-flex gap-3 justify-content-end mt-5 pt-3 border-top border-secondary">
                                <button type="button" className='btn btn-secondary' onClick={handleCancelAction}>
                                    Đóng
                                </button>
                                <button type="button" className='btn btn-success' onClick={saveOrUpdateShowtime}>
                                    <i className="bi bi-check-lg me-2"></i>
                                    Lưu Lịch Chiếu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
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
                            <button className="btn-modal btn-close-modal" onClick={closeNotification}>
                                {notification.type === 'success' ? 'Hoàn tất' : 'Đóng'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ShowtimesForm;