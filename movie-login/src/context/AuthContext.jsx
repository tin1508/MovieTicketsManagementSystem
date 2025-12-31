// context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import { jwtDecode } from 'jwt-decode';

const TOKEN_STORAGE_KEY = 'accessToken';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);

    // --- [MỚI 1] Thêm state để kiểm soát quá trình tải ban đầu ---
    // Mặc định là true (đang tải) để chặn render
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        // Hàm xử lý nội bộ để set User
        const initAuth = () => {
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    console.log(">>> Token decode (F5/Init):", decodedToken);
                    
                    // Kiểm tra thời hạn token (Optional - nên làm)
                    const currentTime = Date.now() / 1000;
                    if (decodedToken.exp && decodedToken.exp < currentTime) {
                         console.warn("Token đã hết hạn");
                         logout();
                    } else {
                        // Token hợp lệ -> Set User
                        setUser({
                            username: decodedToken.sub,
                            roles: decodedToken.scope ? decodedToken.scope.split(' ') : []
                        });
                        setIsAuthenticated(true);
                        // Đảm bảo token nằm trong localStorage
                        localStorage.setItem(TOKEN_STORAGE_KEY, token); 
                    }
                } catch (error) {
                    console.error("Token không hợp lệ trong useEffect:", error);
                    logout();
                }
            } else {
                localStorage.removeItem(TOKEN_STORAGE_KEY);
                setUser(null);
                setIsAuthenticated(false);
            }
            
            // --- [MỚI 2] Báo hiệu đã khởi tạo xong ---
            setIsInitializing(false);
        };

        initAuth();
    }, [token]);

    const login = async (username, password) => {
        try {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            const payload = await authService.loginUser(username, password);
            
            const newToken = payload?.token || payload?.accessToken;

            if (newToken) {
                setToken(newToken);
                
                // Giải mã ngay để return cho Login Form dùng chuyển trang
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
    // 1. Xóa thông tin xác thực (Token & User)
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(TOKEN_STORAGE_KEY);

    // 2. --- QUAN TRỌNG: Xóa tiến trình đặt vé dở dang ---
    // Để người sau đăng nhập vào không bị dính vé của người trước
    sessionStorage.removeItem("bookingState");      // Thông tin ghế đang chọn
    sessionStorage.removeItem("bookingStep1State"); // Thông tin bước 1 (nếu có)
    sessionStorage.removeItem("pendingBooking");    // Thông tin chờ thanh toán (nếu có)
    
    // (Tùy chọn) Điều hướng về trang chủ hoặc login sau khi thoát
    // window.location.href = "/login"; 
    };

    // --- [MỚI 3] Chặn hiển thị App cho đến khi xử lý xong Token ---
    // Nếu đang khởi tạo, hiển thị màn hình trắng hoặc Loading Spinner
    // Điều này ngăn ProtectedRoute chạy khi user đang là null
    if (isInitializing) {
        return (
            <div style={{ 
                height: '100vh', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                fontSize: '18px',
                color: '#666'
            }}>
                Đang tải dữ liệu người dùng...
            </div>
        );
    }

    const value = { token, user, isAuthenticated, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth phải được dùng bên trong AuthProvider');
    }
    return context;
};