import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // 1. Khởi tạo state từ localStorage
    // Lấy 'user' từ localStorage, nếu có thì parse, không thì là null
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error("Lỗi khi parse dữ liệu người dùng từ localStorage", error);
            return null;
        }
    });

    // 2. Sử dụng useEffect để đồng bộ state với localStorage mỗi khi 'user' thay đổi
    useEffect(() => {
        if (user) {
            // Nếu có user, lưu vào localStorage
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            // Nếu không có user (đăng xuất), xóa khỏi localStorage
            localStorage.removeItem('user');
        }
    }, [user]); // Hook này sẽ chạy lại mỗi khi state 'user' thay đổi

    // Hàm login giờ chỉ cần cập nhật state, useEffect sẽ lo việc lưu trữ
    const login = (userData) => {
        setUser(userData);
    };

    // Hàm logout cũng chỉ cần cập nhật state
    const logout = () => {
        setUser(null);
    };

    const value = { user, isAuthenticated: !!user, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};