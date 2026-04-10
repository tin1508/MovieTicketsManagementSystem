import React from 'react';
import '../../../styles/Dashboard.css'; // Dùng chung file CSS
import { NavLink } from 'react-router-dom'; 
const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h3>🎬 Movie Admin</h3>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    {/* Dùng NavLink thay vì thẻ <a> */}
                    <li><NavLink to="/dashboard" end>📊 Tổng quan</NavLink></li>
                    <li><NavLink to="/dashboard/movies">🎟️ Quản lý Phim</NavLink></li>
                    <li><NavLink to="/dashboard/showtimes">🗓️ Quản lý Lịch chiếu</NavLink></li>
                    <li><NavLink to="/dashboard/rooms">🎦 Quản lý phòng chiếu</NavLink></li>
                    <li><NavLink to="/dashboard/seat-types">🛋️ Quản lý loại ghế</NavLink></li>
                    <li><NavLink to="/dashboard/users">👤 Quản lý Người dùng</NavLink></li>
                    <li><NavLink to="/dashboard/bookings">🧾Quản lý đặt phim</NavLink></li>
                    <li><NavLink to="/dashboard/banners">🖼️ Quản lý Banner</NavLink></li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;