// context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import { jwtDecode } from 'jwt-decode'; // Cài bằng: npm install jwt-decode

// 1. Đặt tên key (khóa) LÀ "accessToken"
const TOKEN_STORAGE_KEY = 'accessToken';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
    const [user, setUser] = useState(null); 
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token); 
                console.log(">>> Token decode:", decodedToken);
                setUser({
                    username: decodedToken.sub,
                    roles: decodedToken.scope.split(' ') 
                });
                setIsAuthenticated(true);
                localStorage.setItem(TOKEN_STORAGE_KEY, token); // Lưu token
            } catch (error) {
                console.error("Token không hợp lệ:", error);
                logout(); 
            }
        } else {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            setUser(null);
            setIsAuthenticated(false);
        }
    }, [token]);

    const login = async (username, password) => {
        try {
            // 2. Gọi service (service chỉ trả về data, không lưu)
            localStorage.removeItem(TOKEN_STORAGE_KEY); 
            const payload = await authService.loginUser(username, password); 
            
            const newToken = payload?.token || payload?.accessToken;

            if (newToken) {
                // 3. Context cập nhật state (useEffect sẽ tự động lưu)
                setToken(newToken); 

                // 4. Giải mã và trả về roles cho LoginPage
                const decodedToken = jwtDecode(newToken);
                const roles = decodedToken.scope ? decodedToken.scope.split(' ') : [];
                return roles; 
            } else {
                throw new Error('Không nhận được token');
            }
        } catch (error) {
            console.error("Lỗi AuthContext login:", error);
            throw error; 
        }
    };

    const logout = () => {
        // authService.logoutUser(token); // (Bỏ comment nếu bạn muốn gọi API logout)
        setToken(null); 
    };

    const value = { token, user, isAuthenticated, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook (móc) tùy chỉnh
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth phải được dùng bên trong AuthProvider');
    }
    return context;
};