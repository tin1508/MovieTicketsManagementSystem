import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import '../../styles/ShowtimesListPage.css';
import { patchSeatTypes, getSeatTypeById} from '../../services/SeatTypesService';


const SeatTypeForm = () => {

    const [seatTypeName, setSeatTypeName] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigator = useNavigate();
    const {id} = useParams();
    const highlightedSeatTypeName = <span className="text-warning fst-italic">{seatTypeName}</span>

    useEffect(() => {
        if(id){
            getSeatTypeById(id).then((response) => {
                const seatType = response.data.result;
                setSeatTypeName(seatType.name);
                setBasePrice(seatType.basePrice);
            }).catch(error => {
                const serverErrorMessage = error.response?.data?.message || error.message;
                if(serverErrorMessage !== null){
                    alert("Không tìm thấy seat type!!!");
                } 
            })
        }
    }, [id]);
    const handleBasePrice = (e) => {
        const value = e.target.value;
        if(!/^\d*$/.test(value)){
            setErrorMessage("Vui lòng chỉ nhập số (không nhập chữ hoặc ký tự đặc biệt)!");
            return;
        }
        setErrorMessage('');
        setBasePrice(value);
    }
    function updateSeatType(e){
        e.preventDefault();
        setErrorMessage('');
        const seatType = {basePrice: Number(basePrice)};
        if(id){
            patchSeatTypes(Number(id), seatType).then((response) => {
                console.log("Updated: ", response.data.result);
                navigator('/dashboard/seat-types');
            }).catch(err => {
                setErrorMessage("Error updating seat type");
                console.error(err);
            })
        }
        else alert("Can't find the seat type!!!");
    }
    const handleCancel = () =>{
        navigator('/dashboard/seat-types');
    }
    return (
        <div className='container mt-5'>
            <div className='row'>
                <div className='card col-md-4 offset-md-4 form-card-dark'>
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h2 className='text-center'>Cập nhật giá của loại ghế {highlightedSeatTypeName}</h2>
                    </div>
                    <div className='card-body'>
                        {errorMessage && (
                            <div className='alert alert-danger' role="alert">
                                {errorMessage}
                            </div>
                        )}
                        <form>     
                            <div className='form-group mb-3'>
                                <label className='form-label'>Giá Loại Ghế</label>
                                <input
                                    placeholder="Ví dụ: 45000"
                                    className='form-control dark-input showtimes-filter-input'
                                    type='text'
                                    name='basePrice'
                                    value={basePrice}
                                    onChange={handleBasePrice}
                                />
                            </div>
                            <div className='d-flex gap-2 justify-content-end mt-4'>
                                <button className='btn btn-secondary' onClick={(e) => {e.preventDefault(); handleCancel();}}>Hủy</button>
                                <button className='btn btn-success' onClick={updateSeatType}>Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SeatTypeForm;