import React, {useEffect, useState} from 'react';
import '../styles/ShowtimesListPage.css'; // File CSS dùng chung
import {listRooms, deleteRoom, createRoom} from '../services/RoomsService';
import { useNavigate } from 'react-router-dom';
// Import đầy đủ icon cho Modal
import { FaEdit, FaTrash, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export const ROOM_STATUSES = [
    {value: 'AVAILABLE', label: 'Có sẵn'},
    {value: 'MAINTENANCE', label: 'Đang bảo trì'},
    {value: 'CLOSED', label: 'Đã đóng'}
]

const RoomsListPage = () => {
    const [rooms, setRooms] = useState([]);
    const [cinemaId, setCinemaId] = useState(1); // ID rạp mặc định
    const [filters, setFilters] = useState({ status: '' });
    
    // --- 1. STATE CHO THÔNG BÁO (MODAL) ---
    const [notification, setNotification] = useState({
        show: false,
        type: '',       // 'confirm', 'success', 'error'
        message: '',
        title: '',
        dataId: null    // Lưu ID phòng cần xóa tạm thời
    });

    const navigator = useNavigate();

    useEffect(() => {
        fetchRooms();
    }, [])

    const fetchRooms = () => {
        listRooms().then((response) => {
            const data = response.data.result;
            if (data && Array.isArray(data)) {
                // Sắp xếp dữ liệu trước khi set vào State
                const sortedData = data.sort((a, b) => {
                    // Logic trích xuất số từ tên phòng (Ví dụ: "R12" -> 12)
                    const numA = parseInt(a.name.replace(/\D/g, ''), 10) || 0;
                    const numB = parseInt(b.name.replace(/\D/g, ''), 10) || 0;
                    return numA - numB; // Sắp xếp tăng dần theo số
                });
                setRooms(sortedData);
            } else {
                setRooms([]);
            }
        }).catch(error => {
            console.error(error);
            setRooms([]);
        })
    };

    const handleFilterChange = (event) => {
       const {name, value} = event.target;
       setFilters(prevFilters => ({...prevFilters, [name]: value}))
    }
    const handleClearFilter = () => {
        setFilters({ status: '' })
    }
    const displayedRooms = rooms.filter(room => {
        if(filters.status === '') return true;
        return room.status === filters.status;
    })
    
    // --- 2. HÀM TẠO PHÒNG MỚI (UPDATE: Dùng Modal thông báo) ---
    function addNewRoom(){
        const room = {cinemaId};
        createRoom(room).then((response) => {
            // Hiện thông báo thành công
            showNotification('success', 'Thành công', "Đã tạo phòng chiếu mới: " + response.data.result.name);
            fetchRooms();
        }).catch(error => {
            // Hiện thông báo lỗi
            showNotification('error', 'Lỗi', "Không thể tạo phòng chiếu mới! Vui lòng kiểm tra lại server.");
            console.error(error);
        })
    }
    
    function updateRoom(id){
        navigator(`/dashboard/edit-rooms/${id}`);
    }

    // --- 3. HÀM HỎI XÓA (MỞ MODAL CONFIRM) ---
    function removeRoom(id) {
        setNotification({
            show: true,
            type: 'confirm',
            title: 'Xác nhận xóa',
            message: 'Bạn có chắc chắn muốn xóa phòng chiếu này không? Hành động này không thể hoàn tác.',
            dataId: id 
        });
    }

    // --- 4. HÀM THỰC HIỆN XÓA (KHI BẤM ĐỒNG Ý) ---
    const confirmDelete = () => {
        const idToDelete = notification.dataId;
        
        // Đóng modal confirm ngay lập tức
        closeNotification(); 

        if (idToDelete) {
            deleteRoom(idToDelete).then((response) => {
                fetchRooms();
                showNotification('success', 'Đã xóa', 'Xóa phòng chiếu thành công!');
            }).catch(error => {
                const serverMessage = error.response?.data?.message || error.message;
                let msg = "Có lỗi xảy ra khi xóa!";
                if(serverMessage){
                     msg = "KHÔNG THỂ XÓA: Phòng này hiện đang có suất chiếu hoặc dữ liệu liên quan.";
                }
                showNotification('error', 'Không thể xóa', msg);
            })
        }
    };

    // Helper hiển thị thông báo
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

    const renderStatusBadge = (status) => {
        const statusConfig = ROOM_STATUSES.find(s => s.value === status);
        const label = statusConfig ? statusConfig.label : status;
        let badgeClass = 'status-badge';
        switch (status) {
            case 'AVAILABLE': badgeClass += ' status-showing'; break;
            case 'CLOSED': badgeClass += ' status-ended'; break;
            case 'MAINTENANCE': badgeClass += ' status-cancelled'; break;
            default: badgeClass += ' status-default';
        }
        return <span className={badgeClass}>{label}</span>;
    };

    return (
       <div className='container'>
            <div className='showtimes-page-header'>
                <h1>Quản lý phòng chiếu</h1>
                <button className='showtimes-btn-add-new' onClick={addNewRoom}>Thêm Phòng Chiếu Mới</button>
            </div>
            <div className='showtimes-filter-bar-container'>
                <div className='showtimes-filter-bar'>
                    <select name='status' className='showtimes-filter-select' value={filters.status} onChange={handleFilterChange} style={{marginLeft: '10px'}}>
                        <option value=''>Tất cả trạng thái</option>
                        {ROOM_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    <button type='button' className='showtimes-clear-filter-button' onClick={handleClearFilter} style={{marginLeft: '15px'}}>Bỏ lọc</button>
                </div>
            </div>

            <div>
                <table className='table-container'>
                    <thead>
                        <tr>
                            <th>ID Rạp</th>
                            <th>Tên Phòng</th>
                            <th>Số Ghế/Hàng</th>
                            <th>Tổng Hàng</th>
                            <th>Tổng Ghế</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedRooms.map(room =>
                            <tr key={room.id}>
                                <td>{room.cinema?.id}</td>
                                <td>{room.name}</td>
                                <td>{room.seatsPerRow}</td>
                                <td>{room.totalRows}</td>
                                <td>{room.totalSeats}</td>
                                <td>{renderStatusBadge(room.status)}</td>
                                <td className="showtimes-action-cell">
                                    <div className="showtimes-action-buttons">
                                        <button className="showtimes-btn-icon showtimes-btn-edit" onClick={() => updateRoom(room.id)}>
                                            <FaEdit />
                                        </button>
                                        <button className="showtimes-btn-icon showtimes-btn-delete" onClick={() => removeRoom(room.id)}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {displayedRooms.length === 0 && (
                    <p style={{textAlign: 'center', color: '#999', padding: '20px'}}>Không tìm thấy phòng chiếu</p>
                )}
            </div>

            {/* --- MODAL THÔNG BÁO (ĐÃ CẬP NHẬT CLASS CHUẨN) --- */}
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
                                /* SỬA QUAN TRỌNG: Dùng 'btn-close-modal' thay vì 'btn-close' */
                                <button className="btn-modal btn-close-modal" onClick={closeNotification}>Đóng</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
       </div>
    )
}
export default RoomsListPage;