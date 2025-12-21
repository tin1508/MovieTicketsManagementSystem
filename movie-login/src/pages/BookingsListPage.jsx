import React, {useState, useEffect} from 'react';
import '../styles/ShowtimesListPage.css';
import { listBookings } from '../services/BookingsService';

export const BOOKING_STATUSES = [
    {value: 'PENDING', label: 'Đang chờ'},
    {value: 'CONFIRMED', label: 'Xác nhận'},
    {value: 'REFUNDED', label: 'Đã hoàn tiền'}
]
const BookingsListPage = () => {
    const [bookings, setBookings] = useState([]);
    const [userId, setUserId] = useState('');
    const [showtimeId, setShowtimeId] = useState('');
    const [filters, setFilters] = useState({
        status: ''
    });

    useEffect(() => {
        fetchBookings();
    }, [])

    const fetchBookings = () => {
        listBookings().then((response) => {
            const data = response.data.result;
            if(data) setBookings(data);
            else setBookings([]);
        }).catch(error => {
            console.error(error);
            setBookings([]);
        })
    };
    const handleClearFilter = () => {
        setFilters({
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
            case 'REFUNDED':
                badgeClass += 'status-cancelled'
                break;
            default:
                badgeClass += ' status-default';
        }

        return <span className={badgeClass}>{label}</span>;
    };
    return (
        <div className='container'>
            <div className='showtimes-page-header'>
                <h1> Quản lý đặt vé </h1>
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
                            <th>Thời Gian Hết Hạn</th>
                            <th>Trạng Thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            bookings.map(booking =>
                                <tr key={booking.id}>
                                    <td>{booking.user?.name}</td>
                                    <td>{booking.bookingCode}</td>
                                    <td>{booking.bookingDate}</td>
                                    <td>{booking.ticketQuantity}</td>
                                    <td>{booking.totalPrice}</td>
                                    <td>{booking.expiresAt}</td>
                                    <td>{renderStatusBadge(booking.status)}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
                {bookings.length === 0 && (
                    <p style={{textAlign: 'center', color: '#999', padding: '20px'}}>Không có người dùng nào đặt vé</p>
                )}
            </div>
        </div>
    );
}
export default BookingsListPage;