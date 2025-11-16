// components/layout/UserLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

// 1. Sửa lại đường dẫn import (dấu ./ nghĩa là "cùng thư mục")
import UserNavbar from './UserNavbar'; 
import UserFooter from './UserFooter';
import '../../../styles/UserLayout.css'; // Sẽ tạo file CSS sau
// import UserFooter from './UserFooter'; // TODO: Sẽ thêm sau

const UserLayout = () => {
return (
    <div className="user-layout">
    
        {/* 2. Bỏ comment và SỬ DỤNG UserNavbar */}
            <UserNavbar /> 

            {/* 3. XÓA BỎ header tạm thời */}

            <main>
            <Outlet />
            </main>

            <UserFooter />
    </div>
    );
};

export default UserLayout;