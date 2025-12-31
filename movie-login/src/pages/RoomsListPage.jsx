import React, {useEffect, useState} from 'react';
import '../styles/ShowtimesListPage.css';
import {listRooms, deleteRoom, createRoom} from '../services/RoomsService';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

export const ROOM_STATUSES = [
    {value: 'AVAILABLE', label: 'Có sẵn'},
    {value: 'MAINTENANCE', label: 'Đang bảo trì'},
    {value: 'CLOSED', label: 'Đã đóng'}
]
const RoomsListPage = () => {
    const [rooms, setRooms] = useState([]);
    const [cinemaId, setCinemaId] = useState(1);
    const [filters, setFilters] = useState({
        status: ''
    });

    const navigator = useNavigate();

    useEffect(() => {
        fetchRooms();
    }, [])

    const fetchRooms = () => {
        listRooms().then((response) => {
            const data = response.data.result;
            if(data){
                setRooms(data);
            }else{
                setRooms([]);
            }
        }).catch(error => {
            console.error(error);
            setRooms([]);
        })
    };

    const handleFilterChange = (event) => {
       const {name, value} = event.target;
       setFilters(prevFilters => ({
        ...prevFilters,
        [name]: value
       }))
    }
    const handleClearFilter = () => {
        setFilters({
            status: ''
        })
    }
    const displayedRooms = rooms.filter(room => {
        if(filters.status === '') return true;
        return room.status === filters.status;
    })
    function addNewRoom(){
        const room = {cinemaId};
        createRoom(room).then((response) => {
            alert("Created new room: " + response.data.result.name);
            fetchRooms();
        }).catch(error => {
            alert("Error creating new room!!!");
            console.error(error);
        })
    }
    function updateRoom(id){
        navigator(`/dashboard/edit-rooms/${id}`);
    }
    function removeRoom(id){
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa phòng chiếu này không?")
        if(!isConfirmed) return;
        deleteRoom(id).then((response) => {
            alert("Deleted room");
            fetchRooms();
        }).catch(error => {
            const serverMessage = error.response?.data?.message || error.message;
            if(serverMessage !== null){
                alert("KHÔNG THỂ XÓA: Phòng này hiện đang có suất chiếu!!!")
            }
        })
    }
    const renderStatusBadge = (status) => {
        const statusConfig = ROOM_STATUSES.find(s => s.value === status);
        const label = statusConfig ? statusConfig.label : status;

        let badgeClass = 'status-badge';
        
        switch (status) {
            case 'AVAILABLE':
                badgeClass += ' status-showing';   // Green/Success
                break;
            case 'CLOSED':
                badgeClass += ' status-ended';     // Grey/Secondary
                break;
            case 'MAINTENANCE':
                badgeClass += ' status-cancelled'; // Red/Danger
                break;
            default:
                badgeClass += ' status-default';
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
                        {ROOM_STATUSES.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                    <button
                        type='button'
                        className='showtimes-clear-filter-button'
                        onClick={handleClearFilter}
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
                            <th>ID Rạp Phim</th>
                            <th>Tên Phòng</th>
                            <th>Số Ghế/Hàng</th>
                            <th>Tổng Hàng Ghế</th>
                            <th>Tổng Số Ghế</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            displayedRooms.map(room =>
                                <tr key={room.id}>
                                    <td>{room.cinema?.id}</td>
                                    <td>{room.name}</td>
                                    <td>{room.seatsPerRow}</td>
                                    <td>{room.totalRows}</td>
                                    <td>{room.totalSeats}</td>
                                    <td>{renderStatusBadge(room.status)}</td>
                                    <td className="showtimes-action-cell">
                                        <div className="showtimes-action-buttons">
                                            <button 
                                                className="showtimes-btn-icon showtimes-btn-edit" 
                                                title="Cập nhật"
                                                onClick={() => updateRoom(room.id)} 
                                            >
                                                <FaEdit />
                                            </button>
                                            <button 
                                                className="showtimes-btn-icon showtimes-btn-delete" 
                                                title="Xóa"
                                                onClick={() => removeRoom(room.id)} 
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
                {displayedRooms.length === 0 && (
                    <p style={{textAlign: 'center', color: '#999', padding: '20px'}}>Không tìm thấy phòng chiếu</p>
                )}
            </div>
        </div>

    )
}
export default RoomsListPage;