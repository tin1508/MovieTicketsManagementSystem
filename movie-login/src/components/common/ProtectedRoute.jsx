import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // Nếu người dùng chưa được xác thực, điều hướng họ về trang đăng nhập
        return <Navigate to="/" />;
    }

    // Nếu đã xác thực, hiển thị component con được truyền vào
    return children;
};

export default ProtectedRoute;