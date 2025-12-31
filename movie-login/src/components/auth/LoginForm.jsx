// components/auth/LoginForm.jsx
import React, { useState } from 'react';
// 1. Thêm import useLocation
import { useNavigate, Link, useLocation } from 'react-router-dom'; 
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    // 2. Khai báo hook useLocation
    const location = useLocation(); 
    const { login } = useAuth(); 

    // 3. Lấy địa chỉ trang trước đó (nếu có), nếu không có thì mặc định là "/"
    // location.state.from là object location mà bên SeatSelection gửi sang
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const roles = await login(username, password);
            console.log("👉 CHECK ROLE:", roles);

            if (roles.includes('ADMIN')) {
                navigate('/dashboard');
            } else {
                // 4. SỬA ĐOẠN NÀY: Thay vì về '/', ta về 'from'
                // { replace: true } giúp user không quay lại trang login khi bấm nút Back
                console.log("Redirecting to:", from);
                navigate(from, { replace: true }); 
            }
        } catch (err) {
            console.error("Login Error Catch:", err); // Để ý dòng này trong Console xem nó in ra gì

            // 1. Lấy thông tin lỗi từ nhiều nguồn
            const responseData = err.response?.data;
            const statusCode = err.response?.status; // Ví dụ: 403, 401, 500
            const customCode = responseData?.code;   // Code 1014 của bạn

            // 2. Logic kiểm tra: Bắt code 1014 HOẶC bắt status 403 (Forbidden)
            // Lưu ý: Đôi khi Spring Security trả về 403 mà chưa kịp custom body JSON, nên bắt cả statusCode cho chắc.
            if (customCode === 1014 || statusCode === 403) {
                setError(
                    "Tài khoản của bạn đã bị vô hiệu hóa do vi phạm điều khoản sử dụng. " + 
                    "Để được hỗ trợ, vui lòng liên hệ email: hotro@moviebooking.com hoặc hotline: 3636 3663."
                );
            } 
            else {
                // Các lỗi khác
                const serverMessage = responseData?.message || err.message;
                setError(serverMessage || 'Tên đăng nhập hoặc mật khẩu không đúng.');
            }

            setIsLoading(false);
        }
    };

    return (
        <> 
            <div className="login-header">
                <h2>Đăng Nhập</h2>
                <p>Chào mừng trở lại!</p>
            </div>
            
            {error && (
                <div className="error-message" style={{ 
                    color: '#d32f2f', 
                    backgroundColor: '#ffebee', 
                    padding: '10px', 
                    borderRadius: '4px', 
                    marginBottom: '15px',
                    fontSize: '0.9rem',
                    lineHeight: '1.4',
                    border: '1px solid #ef9a9a'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="login-username">Tên đăng nhập</label>
                    <input
                        type="text"
                        id="login-username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="login-password">Mật khẩu</label>
                    <input
                        type="password"
                        id="login-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                <div style={{ textAlign: 'right', marginBottom: '15px' }}>
                    <Link 
                        to="/forgot-password" 
                        style={{ 
                            color: '#ffc107', 
                            fontSize: '0.9rem', 
                            textDecoration: 'none',
                            fontStyle: 'italic'
                        }}
                        onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                    >
                        Quên mật khẩu?
                    </Link>
                </div>

                <button type="submit" className="login-button" disabled={isLoading}>
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
            </form>
        </>
    );
};

export default LoginForm;