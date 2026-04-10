import React, {useEffect, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/ShowtimesListPage.css';
import { FaEdit } from 'react-icons/fa';
import { listSeatTypes } from '../services/SeatTypesService';

const SeatTypesListPage = () => {

    const [allSeatTypes, setAllSeatTypes] = useState([]);  
    const [loading, setLoading] = useState(true);  
    
    const navigator = useNavigate();

    useEffect(() => {
        fetchSeatTypes();
    }, [])
    const fetchSeatTypes = () => {
        setLoading(true);
        listSeatTypes().then((response) => {
            const data = response.data.result;
            if(data){
                setAllSeatTypes(data);
            }
            else setAllSeatTypes([])
            setLoading(false);
        }).catch(error => {
            console.error(error);
            setAllSeatTypes([]);
            setLoading(false);
        })
    };

    function updateSeatType(id){
        navigator(`/dashboard/edit-seat-types/${id}`);
    }
    return (
        <div className='container'>
            <div className='showtimes-page-header'>
                <h1>Quản lý loại ghế</h1>
            </div>
            <div>
                {allSeatTypes && allSeatTypes.length > 0 ? (
                    <table className='table-container'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Loại Ghế</th>
                                <th>Giá</th>
                                <th>Cập nhật giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allSeatTypes.map(seatType =>
                                    <tr key={seatType.id}>  
                                        <td>{seatType.id}</td>                                      
                                        <td>{seatType.name}</td>
                                        <td>{seatType.basePrice.toLocaleString('vi-VN')}</td>
                                        <td className="showtimes-action-cell">
                                            <div className="showtimes-action-buttons">
                                                <button 
                                                    className="showtimes-btn-icon showtimes-btn-edit" 
                                                    title="Cập nhật"
                                                    onClick={() => updateSeatType(seatType.id)} 
                                                >
                                                    <FaEdit />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px', fontSize: '18px', color: '#666' }}>
                        {!loading ? "Không có loại ghế" : "Đang tải..."}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SeatTypesListPage;