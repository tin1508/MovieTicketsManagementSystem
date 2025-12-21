import React, {useEffect, useState} from 'react';
import '../../styles/ShowtimesListPage.css';
import { getRoomById, patchRoom,  listRooms} from '../../services/RoomsService';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { useNavigate, useParams } from 'react-router-dom';
import { ROOM_STATUSES } from '../../pages/RoomsListPage';

const RoomsForm = () => {
    
    const [allRooms, setAllRooms] = useState([]);
    const [cinemaId, setCinemaId] = useState(1);
    const [roomName, setRoomName] = useState('');
    const [totalRows, setTotalRows] = useState(1);
    const [seatsPerRow, setSeatsPerRow] = useState(1);
    const [status, setStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigator = useNavigate();
    const {id} = useParams();

    useEffect(() => {
        // Load all rooms to check for duplicates later
        listRooms().then((response) => {
            setAllRooms(response.data); 
        }).catch(error => {
            console.error("Error fetching rooms list:", error);
        });

        if(id){
            getRoomById(id).then((response) => {
                const room = response.data.result; // Adjust based on your API structure
                setRoomName(room.name);
                setTotalRows(room.totalRows);
                setSeatsPerRow(room.seatsPerRow);
                setStatus(room.status);
                setCinemaId(room.cinema?.id);
            }).catch(error => {
                console.error("Error fetching showtime details: ", error);
            })
        }
    }, [id]);

    const handleRowChange = (e) => setTotalRows(e.target.value);
    const handleSeatChange = (e) => setSeatsPerRow(e.target.value);
    const handleStatus = (e) => setStatus(e.target.value);
    const handleBlur = (value, setter) => {
        const num = parseInt(value);
        if(!num || num < 1 || isNaN(num)) {
            setter(1); // Reset to 1 if empty or invalid
        } else {
            setter(num); // Ensure it is stored as a number
        }
    }
    const handleDecreaseRows = (e) => {
        e.preventDefault();
        if(totalRows > 1) setTotalRows(prev => Number(prev) - 1);
    };
    const handleIncreaseRows = (e) => {
        e.preventDefault();
        setTotalRows(prev => Number(prev) + 1);
    };
    const handleDecreaseSeats = (e) => {
        e.preventDefault();
        if(seatsPerRow > 1) setSeatsPerRow(prev => Number(prev) - 1);
    };
    const handleIncreaseSeats = (e) => {
        e.preventDefault();
        setSeatsPerRow(prev => Number(prev) + 1);
    }
    const handleCancel = () =>{
        navigator('/dashboard/rooms')
    };
    function updateRoom(e){
        e.preventDefault();
        setErrorMessage('');
        const room = {cinemaId, totalRows, seatsPerRow, status};
        if(id){
            patchRoom(Number(id), room).then((response) => {
                console.log("Updated: ", response.data.result);
                navigator('/dashboard/rooms');
            }).catch(err =>{
                setErrorMessage("Error updating room");
                console.error(err);
            });
        }
        else{
            alert("Can't find the room!!!")
        }
    }
    return (
        <div className='container mt-5'>
            <div className='row'>
                <div className='card col-md-4 offset-md-4 form-card-dark'>
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h2>Cập Nhật Phòng Chiếu</h2>
                    </div>
                    <div className='card-body'>
                        {errorMessage && (
                            <div className="alert alert-danger" role="alert">
                                {errorMessage}
                            </div>
                        )}
                        <form>
                            <div className='form-group mb-4 d-flex flex-column align-items-center'>
                                <label className='form-label fw-bold'>Tổng Số Hàng Ghế:</label>
                                <div className="quantity-selector mt-2">
                                    <div className="quantity-controls d-flex align-items-center">
                                        <button className="btn btn-outline-light quantity-btn minus" onClick={handleDecreaseRows}> - </button>
                                        
                                        <input 
                                            type="number"
                                            className="quantity-input mx-2"
                                            value={totalRows}
                                            onChange={handleRowChange}
                                            onBlur={() => handleBlur(totalRows, setTotalRows)}
                                        />

                                        <button className="btn btn-outline-light quantity-btn plus" onClick={handleIncreaseRows}> + </button>
                                    </div>
                                </div>
                            </div>
                            <div className='form-group mb-4 d-flex flex-column align-items-center'>
                                <label className='form-label fw-bold'>Số Ghế Trên 1 Hàng:</label>
                                <div className="quantity-selector mt-2">
                                    <div className="quantity-controls d-flex align-items-center">
                                        <button className="btn btn-outline-light quantity-btn minus" onClick={handleDecreaseSeats}> - </button>
                                        
                                        {/* REPLACED SPAN WITH INPUT */}
                                        <input 
                                            type="number"
                                            className="quantity-input mx-2"
                                            value={seatsPerRow}
                                            onChange={handleSeatChange}
                                            onBlur={() => handleBlur(seatsPerRow, setSeatsPerRow)}
                                        />

                                        <button className="btn btn-outline-light quantity-btn plus" onClick={handleIncreaseSeats}> + </button>
                                    </div>
                                </div>
                            </div>
                            <div className='form-group mb-3'>
                                <label className='form-label'> Trạng Thái: </label>
                                <select 
                                    className='form-select dark-input'
                                    name='status'
                                    value={status} 
                                    onChange={handleStatus}
                                >
                                    {/* Use the imported constant */}
                                    {ROOM_STATUSES.map(s => (
                                        <option key={s.value} value={s.value}>
                                            {s.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='d-flex justify-content-end mt-4'>
                                <button className="btn btn-success me-2" onClick={updateRoom}>Cập nhật</button>
                                <button className="btn btn-secondary" onClick={ (e) => {e.preventDefault(); handleCancel();} }>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default RoomsForm;
