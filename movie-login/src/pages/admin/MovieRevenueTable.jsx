import React from 'react';
import '../../styles/Dashboard.css'; // Dùng chung file CSS dashboard

const MovieRevenueTable = ({ data }) => {
    
    // Format tiền
    const formatCurrency = (value) => 
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

    return (
        <div className="chart-box" style={{ marginTop: '20px' }}>
            <h3>Chi Tiết Doanh Thu Theo Phim</h3>
            <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="stats-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên Phim</th>
                            <th className="text-center">Số Vé Bán</th>
                            <th className="text-right">Tổng Doanh Thu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.length > 0 ? (
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td style={{ fontWeight: 'bold', color: '#ffc107' }}>
                                        {item.movieName}
                                    </td>
                                    <td className="text-center">{item.ticketCount}</td>
                                    <td className="text-right" style={{ color: '#2ecc71', fontWeight: 'bold' }}>
                                        {formatCurrency(item.revenue)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">Chưa có dữ liệu</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MovieRevenueTable;