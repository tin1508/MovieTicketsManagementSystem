import React from 'react';
// Đảm bảo file Dashboard.css đã được import ở component cha (Dashboard.js)
// hoặc import trực tiếp tại đây: import './Dashboard.css';

const StatsCard = ({ title, value, icon, color }) => {
    
    // Xử lý style động cho icon nếu có prop "color" truyền vào
    // Nếu không có màu, mặc định sẽ dùng class CSS
    const iconStyle = color ? {
        backgroundColor: `${color}20`, // Thêm độ trong suốt (Hex opacity 20%)
        color: color,
        border: `1px solid ${color}40`,
        boxShadow: `0 0 15px ${color}20`
    } : {};

    return (
        <div className="stats-card">
            <div className="stats-info">
                <h4>{title}</h4>
                <span>{value}</span>
            </div>
            
            <div className="stats-icon-container" style={iconStyle}>
                {icon}
            </div>
        </div>
    );
};

export default StatsCard;