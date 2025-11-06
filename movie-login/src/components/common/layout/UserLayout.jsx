// components/layout/UserLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

// TODO: Sau này bạn có thể tạo và import UserNavbar/UserFooter
// import UserNavbar from './UserNavbar';
// import UserFooter from './UserFooter';

const UserLayout = () => {
    return (
        <div className="user-layout">
            
            {/* Đây là Navbar (Header) tạm thời cho trang User */}
            {/* <UserNavbar /> */}
            <header style={{ 
                padding: '1rem 2rem', 
                backgroundColor: '#0f3460', // Tái sử dụng màu theme
                color: 'white', 
                fontSize: '1.2rem',
                fontWeight: 'bold'
            }}>
                Logo (Trang Khách Hàng)
            </header>

            <main style={{ minHeight: '80vh' }}>
                {/* <Outlet /> là nơi React Router
                sẽ render các trang con 
                (như HomePage, MovieDetailPage) */}
                <Outlet />
            </main>
            
            {/* Đây là Footer tạm thời */}
            {/* <UserFooter /> */}
            <footer style={{ 
                padding: '2rem', 
                backgroundColor: '#0f3460', 
                color: '#c4c3ca', 
                textAlign: 'center', 
                marginTop: '2rem' 
            }}>
                Movie Booking System Footer © 2025
            </footer>
        </div>
    );
};

export default UserLayout;