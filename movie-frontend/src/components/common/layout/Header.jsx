import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import '../../../styles/Dashboard.css';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="dashboard-header">
            <h2>Bảng Điều Khiển</h2>
            <div className="user-info">
                <span>Chào, <strong>{user?.name || 'Admin'}</strong></span>
                <button onClick={logout} className="logout-button">Đăng xuất</button>
            </div>
        </header>
    );
};

export default Header;