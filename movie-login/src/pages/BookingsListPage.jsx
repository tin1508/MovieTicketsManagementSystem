import React, {useState, useEffect} from 'react';
import '../styles/ShowtimesListPage.css';
import { listBookings } from '../services/BookingsService';
import {formatDate} from './ShowtimeListPage';

export const BOOKING_STATUSES = [
    {value: 'PENDING', label: 'Đang chờ'},
    {value: 'CONFIRMED', label: 'Xác nhận'},
    {value: 'CANCELLED', label: 'Đã hủy'}
]
const BookingsListPage = () => {
    const [bookings, setBookings] = useState([]);

    const [filteredBookings, setFilterBookings] = useState([]);
    
    const [filters, setFilters] = useState({
        username: '',
        bookingCode: '',
        bookingDate: '',
        ticketQuantity: '',
        totalPrice: '',
        status: ''
    });

    useEffect(() => {
        fetchBookings();
    }, [])
    useEffect(() => {
        const result = bookings.filter(item => {
            // Username: Search by keyword (case insensitive)
            const matchUsername = item.user?.username?.toLowerCase().includes(filters.username.toLowerCase()) || filters.username === '';
            
            // Booking Code: Search by keyword
            const matchCode = item.bookingCode?.toLowerCase().includes(filters.bookingCode.toLowerCase()) || filters.bookingCode === '';
            
            // Date: String match (contains)
            const matchDate = item.bookingDate?.includes(filters.bookingDate) || filters.bookingDate === '';
            
            // Quantity: Convert number to string to search by keyword (e.g. typing "1" finds "10", "12")
            const matchQuantity = item.ticketQuantity?.toString().includes(filters.ticketQuantity) || filters.ticketQuantity === '';
            
            // Price: Convert to string to search by keyword
            const cleanSearchPrice = filters.totalPrice.replace(/[.,]/g,'');
            const matchPrice = item.totalPrice?.toString().includes(cleanSearchPrice) || filters.totalPrice === '';
            
            // Status: Exact match for dropdown
            const matchStatus = filters.status === '' || item.status === filters.status;

            return matchUsername && matchCode && matchDate && matchQuantity && matchPrice && matchStatus;
        })
        
        // Update the list to be displayed
        setFilterBookings(result);
    }, [bookings, filters]);
    const fetchBookings = () => {
        listBookings().then((response) => {
            const data = response.data.result;
            if(data){
                setBookings(data);
                setFilterBookings(data);
            }
            else{
                setBookings([]);
                setFilterBookings([]);
            }
        }).catch(error => {
            console.error(error);
            setBookings([]);
            setFilterBookings([]);
        })
    };
    const handleFilterChange = (e) => {
        const {name, value} = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    }
    const handleClearFilter = () => {
        setFilters({
            username: '',
            bookingCode: '',
            bookingDate: '',
            ticketQuantity: '',
            totalPrice: '',
            status: ''
        })
    }
    const renderStatusBadge = (status) => {
        const statusConfig = BOOKING_STATUSES.find(s => s.value === status);
        const label = statusConfig ? statusConfig.label : status;

        let badgeClass = 'status-badge';
        
        switch (status) {
            case 'PENDING':
                badgeClass += ' status-yellow';   // Green/Success
                break;
            case 'CONFIRMED':
                badgeClass += ' status-showing';     // Grey/Secondary
                break;
            case 'CANCELLED':
                badgeClass += ' status-cancelled';
                break;
            default:
                badgeClass += ' status-default';
        }

        return <span className={badgeClass}>{label}</span>;
    };
    return (
        <div className='container'>
            <div className='showtimes-page-header'>
                <h1> Quản lý đặt phim </h1>
            </div>
            <div className='showtimes-filter-bar-container'>
                <div className='showtimes-filer-bar' style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                    
                    {/* 1. Username */}
                    <input
                        className='showtimes-filter-input'
                        type="text"
                        name="username"
                        placeholder="Tìm username..."
                        value={filters.username}
                        onChange={handleFilterChange}
                        style={{ width: '130px' }} // Tùy chỉnh width để vừa hàng
                    />

                    {/* 2. Booking Code */}
                    <input
                        className='showtimes-filter-input'
                        type="text"
                        name="bookingCode"
                        placeholder="Mã vé..."
                        value={filters.bookingCode}
                        onChange={handleFilterChange}
                        style={{ width: '100px' }}
                    />

                    {/* 3. Date Select */}
                    <input 
                        className='showtimes-filter-select showtimes-filter-date-bookings'
                        type='date'
                        name='bookingDate'
                        value={filters.bookingDate}
                        onChange={handleFilterChange}
                        data-date={formatDate(filters.bookingDate)}
                        style={{width: '100px'}}
                    />

                
                    
                    {/* 6. Status Select */}
                    <select 
                        name='status' 
                        className='showtimes-filter-select' 
                        value={filters.status} 
                        onChange={handleFilterChange}
                    >
                        <option value=''>Tất cả trạng thái</option>
                        {BOOKING_STATUSES.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>

                    {/* 7. Clear Button */}
                    <button
                        type='button'
                        className='showtimes-clear-filter-button'
                        onClick={handleClearFilter}
                    >
                        Bỏ lọc
                    </button>
                </div>
            </div>
            <div>
                <table className='table-container'>
                    <thead>
                        <tr>
                            <th>Tên Người Dùng</th>
                            <th>Mã Đặt Vé</th>
                            <th>Ngày Đặt Vé</th>
                            <th>Số Lượng Vé Đặt</th>
                            <th>Tổng Tiền</th>
                            <th>Trạng Thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredBookings.map(booking =>
                                <tr key={booking.id}>
                                    <td>{booking.user?.username}</td>
                                    <td>{booking.bookingCode}</td>
                                    <td>{formatDate(booking.bookingDate)}</td>
                                    <td style={{ textAlign: 'center' }}>{booking.ticketQuantity}</td>
                                    <td>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalPrice)}
                                    </td>
                                    <td>{renderStatusBadge(booking.status)}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
                {bookings.length > 0 && filteredBookings.length === 0 && (
                    <p style={{textAlign: 'center', color: '#999', padding: '20px'}}> Không có dữ liệu </p>
                )}
                {bookings.length === 0 && (
                    <p style={{textAlign: 'center', color: '#999', padding: '20px'}}>Không có người dùng nào đặt vé</p>
                )}
            </div>
        </div>
    );
}
export default BookingsListPage;